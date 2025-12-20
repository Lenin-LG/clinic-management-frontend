import { Injectable, signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../evironments/environment';
import { AuthUtils } from '../auth/auth.utils';
export interface WsChatMessage {
  from?: string;  
  to: string;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatWsService {

  private client!: Client;

  connected = signal(false);
  messages = signal<WsChatMessage[]>([]);
  onlineUsers = signal<string[]>([]);

  connect(): void {
    const token = localStorage.getItem('accessToken');
    if (!token) return;

    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      }
    });

    this.client.onConnect = () => {
      this.connected.set(true);
        this.client.onStompError = (frame) => {
  console.error('❌ Error STOMP', frame);
};
this.client.onWebSocketError = (evt) => {
  console.error('❌ Error WS', evt);
};
      /* usuarios online (opcional) */
      this.client.subscribe('/topic/usuarios', (msg: IMessage) => {
        this.onlineUsers.set(JSON.parse(msg.body));
      });

      /* MENSAJES PRIVADOS (única fuente de verdad) */
      this.client.subscribe('/user/queue/messages', (msg: IMessage) => {
        const data: WsChatMessage = JSON.parse(msg.body);
        this.messages.update(m => [...m, data]);
      });
    };

    this.client.onDisconnect = () => {
      this.connected.set(false);
    };

    this.client.activate();
  }

  disconnect(): void {
    this.client?.deactivate();
  }

  /* SOLO ENVÍA — NO MODIFICA UI */
sendPrivateMessage(to: string, content: string): void {
  if (!this.client?.connected) {
    console.warn('❌ No conectado');
    return;
  }

  this.client.publish({
    destination: '/app/chat/private',
    body: JSON.stringify({ to, content })
  });
}


}
