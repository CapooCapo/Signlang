import { Injectable, inject, signal } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {
  private authService = inject(AuthService);
  private sockets: Map<string, WebSocket> = new Map();
  private messages$ = new Subject<any>();

  public onMessage(): Observable<any> {
    return this.messages$.asObservable();
  }

  /**
   * Connect to a specific WebSocket endpoint.
   * @param path The path to connect to (e.g., 'ws/community/')
   * @param key A unique key to identify this connection
   */
  connect(path: string, key: string): void {
    if (this.sockets.has(key)) return;

    const token = this.authService.accessToken();
    if (!token) return;

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // Use the backend host. In production, this might be different.
    // For local dev with Docker, we assume it's localhost:8000
    const host = 'localhost:8000';
    const url = `${protocol}//${host}/${path}?token=${token}`;

    const socket = new WebSocket(url);

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      this.messages$.next({ key, ...data });
    };

    socket.onclose = () => {
      this.sockets.delete(key);
      // Auto-reconnect after 3 seconds
      setTimeout(() => this.connect(path, key), 3000);
    };

    socket.onerror = (error) => {
      console.error(`WebSocket error for ${key}:`, error);
      socket.close();
    };

    this.sockets.set(key, socket);
  }

  send(key: string, data: any): void {
    const socket = this.sockets.get(key);
    if (socket && socket.readyState === WebSocket.OPEN) {
      socket.send(JSON.stringify(data));
    }
  }

  disconnect(key: string): void {
    const socket = this.sockets.get(key);
    if (socket) {
      socket.close();
      this.sockets.delete(key);
    }
  }
}
