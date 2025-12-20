import { Injectable,signal } from '@angular/core';
import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { environment } from '../../../evironments/environment';
export interface Notificacion {
  tipo: string;
  mensaje: string;
  timestamp: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationWsService {

  private client!: Client;

  notificacion = signal<Notificacion | null>(null);

  connect(): void {
    this.client = new Client({
      webSocketFactory: () => new SockJS(`${environment.apiUrl}/ws`),
      reconnectDelay: 5000,
    });

    this.client.onConnect = () => {
      this.client.subscribe('/topic/notificaciones', (msg: IMessage) => {
        const data: Notificacion = JSON.parse(msg.body);
        this.notificacion.set(data);

        // Auto ocultar en 2 segundos
        setTimeout(() => this.notificacion.set(null), 2000);
      });
    };

    this.client.activate();
  }
}
