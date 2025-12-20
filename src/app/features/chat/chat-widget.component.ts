import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../evironments/environment';
import { ChatWsService } from '../../core/websockets/chat-ws.service';
import { AuthUtils } from '../../core/auth/auth.utils';

/* ================== MODELOS ================== */
interface ChatMessage { from: 'user' | 'ai'; text: string; }
interface Contacto { id: number | 'AI'; username?: string; nombre: string; tipo: 'AI' | 'USER';  }
type ViewMode = 'LIST' | 'CHAT';

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styles: [`
    /* 1. Animación de los puntos de carga */
    .typing-dot { @apply h-2 w-2 bg-gray-500 rounded-full animate-bounce; }

    /* 2. Forzar que el contenedor de la lista respete el scroll */
    .custom-scroll {
      display: block;
      overflow-y: auto !important;
      scrollbar-width: thin; /* Para Firefox */
      scrollbar-color: #ccc #f1f1f1;
    }

    /* 3. Estilos de la barra para Chrome/Edge/Safari */
    .custom-scroll::-webkit-scrollbar {
      width: 6px;
      display: block;
    }
    .custom-scroll::-webkit-scrollbar-track {
      background: #f1f1f1;
    }
    .custom-scroll::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }
    .custom-scroll::-webkit-scrollbar-thumb:hover {
      background: #999;
    }
  `]
})
export class ChatWidgetComponent implements OnInit {
  private http = inject(HttpClient);
  private chatWs = inject(ChatWsService);

  // Estados de UI
  open = signal(false);
  viewMode = signal<ViewMode>('LIST');
  chatActivo = signal<Contacto | null>(null);
  
  // Estados de Chat
  input = '';
  sending = signal(false);
  conversationId = crypto.randomUUID();
  aiMessages = signal<ChatMessage[]>([]); // Solo para la persistencia local de la IA

  // Estados de Paginación
  contactos = signal<Contacto[]>([{ id: 'AI', nombre: 'Agente AI', tipo: 'AI' }]);
  page = 0;
  lastPage = false;
  loading = false;

  /**
   * RECTA FINAL: Los mensajes se calculan automáticamente. 
   * Combina historial de WS y mensajes de IA local.
   */
  messages = computed(() => {
    const contacto = this.chatActivo();
    if (!contacto) return [];

    const bienvenida: ChatMessage = {
      from: 'ai',
      text: contacto.tipo === 'AI' ? 'Hola 👋 ¿En qué te ayudo?' : `💬 Chat con ${contacto.nombre}`
    };

    if (contacto.tipo === 'AI') return [bienvenida, ...this.aiMessages()];

    // Filtrado reactivo de mensajes de WebSocket
    const wsHistory = this.chatWs.messages()
      .filter(m => m.from === contacto.username || m.to === contacto.username)
      .map(m => ({
        from: (m.from === contacto.username ? 'ai' : 'user') as 'ai' | 'user',
        text: m.content
      }));

    return [bienvenida, ...wsHistory];
  });

  ngOnInit() {
    this.cargarUsuarios();
  }

  /* ================== LÓGICA DE NEGOCIO ================== */

  toggle(): void {
    this.open.update(v => !v);
    this.viewMode.set('LIST');
    this.open() ? this.chatWs.connect() : this.chatWs.disconnect();
  }

  abrirChat(contacto: Contacto): void {
    this.chatActivo.set(contacto);
    this.viewMode.set('CHAT');
    if (contacto.tipo === 'AI') {
      this.conversationId = crypto.randomUUID();
      this.aiMessages.set([]);
    }
  }

  cargarUsuarios(): void {
  // 1. Bloqueo de seguridad
  if (this.loading || this.lastPage) return;
  
  this.loading = true;

  const token = localStorage.getItem('accessToken');
  const miUsername = token ? AuthUtils.getUsernameFromToken(token)?.toLowerCase() : null;

  // 2. Usamos el Signal de 'page' actual
  this.http.get<any>(`${environment.apiUrl}/public/api/auth?page=${this.page}&size=10`)
    .subscribe({
      next: (resp) => {
        const nuevos: Contacto[] = resp.content
          .filter((u: any) => u.username.toLowerCase() !== miUsername)
          .map((u: any) => ({
            id: u.id, 
            username: u.username, 
            nombre: `${u.nombre} ${u.apellido}`, 
            tipo: 'USER'
          }));

        // 3. Insertar nuevos usuarios sin borrar los anteriores (y sin duplicar la IA)
        this.contactos.update(actuales => {
          // Filtramos por ID para evitar duplicados accidentales si el backend repite datos
          const idsExistentes = new Set(actuales.map(c => c.id));
          const filtrados = nuevos.filter(n => !idsExistentes.has(n.id));
          return [...actuales, ...filtrados];
        });

        // 4. Actualizar estado de paginación
        this.lastPage = resp.last;
        if (!this.lastPage) {
          this.page++; // Solo sumamos si hay más por cargar
        }
      },
      error: (err) => {
        console.error("Error cargando usuarios", err);
      },
      complete: () => {
        this.loading = false;
      }
    });
}

  send(): void {
    const text = this.input.trim();
    const contacto = this.chatActivo();
    if (!text || !contacto || this.sending()) return;

    this.input = '';

    if (contacto.tipo === 'AI') {
      this.enviarAIA(text);
    } else {
      this.chatWs.sendPrivateMessage(contacto.username!, text);
    }
  }

  private enviarAIA(text: string): void {
    this.aiMessages.update(m => [...m, { from: 'user', text }]);
    this.sending.set(true);

    this.http.post(`${environment.apiUrl}/api/chat?conversationId=${this.conversationId}`, text, { responseType: 'text' })
      .subscribe({
        next: resp => {
          const formattedText = resp
            .replace(/(\d+\.)/g, '\n$1') // Salto antes de números: 1. 2.
            .replace(/\.\s+/g, '.\n\n'); // Doble salto tras punto y seguido

          this.aiMessages.update(m => [...m, { from: 'ai', text: formattedText.trim() }]);
        },
        error: () => this.aiMessages.update(m => [...m, { from: 'ai', text: '⚠️ Error de conexión.' }]),
        complete: () => this.sending.set(false)
      });
  }

  onScroll(event: any): void {
  const element = event.target;
  const currentPosition = element.scrollTop + element.clientHeight;
  const threshold = element.scrollHeight - 50; 

  if (currentPosition >= threshold) {
    this.cargarUsuarios();
  }
}

  volver = () => { this.viewMode.set('LIST'); this.chatActivo.set(null); };
}