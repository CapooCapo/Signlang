import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { CommunityPost, PostComment, Notification } from '../models/community.model';
import { WebsocketService } from './websocket.service';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private http = inject(HttpClient);
  private wsService = inject(WebsocketService);
  private apiUrl = `${environment.apiUrl}/community`;

  // Signals for State Management
  posts = signal<CommunityPost[]>([]);
  notifications = signal<Notification[]>([]);
  unreadNotifCount = signal<number>(0);

  constructor() {
    this.setupWebsocket();
  }

  private setupWebsocket() {
    this.wsService.connect('ws/community/', 'feed');
    this.wsService.onMessage()
      .pipe(filter(msg => msg.key === 'feed'))
      .subscribe(msg => {
        if (msg.type === 'feed_update') {
          if (msg.action === 'new_post') {
            this.posts.update(prev => [msg.data, ...prev]);
          } else if (msg.action === 'new_comment') {
            this.posts.update(prev => prev.map(p => 
              p.id === msg.post_id ? { ...p, comment_count: p.comment_count + 1 } : p
            ));
          }
        } else if (msg.type === 'notification_created') {
          this.notifications.update(prev => [msg.data, ...prev]);
          this.unreadNotifCount.update(c => c + 1);
        }
      });
  }

  getPosts() {
    return this.http.get<CommunityPost[]>(`${this.apiUrl}/posts/`).subscribe(data => {
      this.posts.set(data);
    });
  }

  createPost(data: any) {
    return this.http.post<CommunityPost>(`${this.apiUrl}/posts/`, data);
  }

  getComments(postId: string) {
    return this.http.get<PostComment[]>(`${this.apiUrl}/posts/${postId}/comments/`);
  }

  addComment(postId: string, content: string) {
    return this.http.post<PostComment>(`${this.apiUrl}/posts/${postId}/comment/`, { content });
  }

  react(postId: string, type: string) {
    return this.http.post(`${this.apiUrl}/posts/${postId}/react/`, { type });
  }

  getNotifications() {
    return this.http.get<Notification[]>(`${this.apiUrl}/notifications/`).subscribe(data => {
      this.notifications.set(data);
      this.unreadNotifCount.set(data.filter(n => !n.is_read).length);
    });
  }

  markAllRead() {
    return this.http.post(`${this.apiUrl}/notifications/mark_all_read/`, {}).subscribe(() => {
      this.unreadNotifCount.set(0);
    });
  }
}
