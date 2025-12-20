import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NotificationWsService } from './core/websockets/notification-ws.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  protected readonly title = signal('LENIN');

  constructor(public ws: NotificationWsService) {}

  ngOnInit(): void {
    this.ws.connect();
  }
}
