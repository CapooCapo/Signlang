import { Injectable, inject, signal } from '@angular/core';
import { CommunityPost, PostComment, Notification } from '../models/community.model';
import { WebsocketService } from './websocket.service';
import { filter, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  private apiService = inject(ApiService);
  private wsService = inject(WebsocketService);
  private readonly baseUrl = '/community';

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
    return this.apiService.get<ApiResponse<CommunityPost[]>>(`${this.baseUrl}/posts/`).pipe(
      map(res => res.object),
      tap(data => this.posts.set(data))
    ).subscribe();
  }

  createPost(data: { content: string; post_type: string }) {
    return this.apiService.post<ApiResponse<CommunityPost>>(`${this.baseUrl}/posts/`, data).pipe(
      map(res => res.object)
    );
  }

  getComments(postId: string) {
    return this.apiService.get<ApiResponse<PostComment[]>>(`${this.baseUrl}/posts/${postId}/comments/`).pipe(
      map(res => res.object)
    );
  }

  addComment(postId: string, content: string) {
    return this.apiService.post<ApiResponse<PostComment>>(`${this.baseUrl}/posts/${postId}/comment/`, { content }).pipe(
      map(res => res.object)
    );
  }

  react(postId: string, type: string) {
    return this.apiService.post<ApiResponse<any>>(`${this.baseUrl}/posts/${postId}/react/`, { type }).pipe(
      map(res => res.object)
    );
  }

  getNotifications() {
    return this.apiService.get<ApiResponse<Notification[]>>(`${this.baseUrl}/notifications/`).pipe(
      map(res => res.object),
      tap(data => {
        this.notifications.set(data);
        this.unreadNotifCount.set(data.filter(n => !n.is_read).length);
      })
    ).subscribe();
  }

  markAllRead() {
    return this.apiService.post<ApiResponse<any>>(`${this.baseUrl}/notifications/mark_all_read/`, {}).pipe(
      map(res => res.object),
      tap(() => this.unreadNotifCount.set(0))
    ).subscribe();
  }
}
