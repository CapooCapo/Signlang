import { Injectable, inject, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GroupChat, GroupMessage } from '../models/community.model';
import { WebsocketService } from './websocket.service';
import { filter, map, tap } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private apiService = inject(ApiService);
  private wsService = inject(WebsocketService);
  private readonly baseUrl = '/community/groups';

  groups = signal<GroupChat[]>([]);
  activeMessages = signal<GroupMessage[]>([]);
  typingUsers = signal<Record<string, string[]>>({}); // group_id -> [full_name]
  
  isDrawerOpen = signal(false);
  selectedGroupId = signal<string | null>(null);

  toggleDrawer() {
    this.isDrawerOpen.update(v => !v);
    if (this.isDrawerOpen() && this.groups().length === 0) {
      this.getGroups().subscribe();
    }
  }

  openChat(groupId: string) {
    this.selectedGroupId.set(groupId);
    this.isDrawerOpen.set(true);
    this.getMessages(groupId).subscribe();
    this.connectToChat(groupId);
  }

  getGroups() {
    return this.apiService.get<ApiResponse<GroupChat[]>>(`${this.baseUrl}/`).pipe(
      map(res => res.object),
      tap(data => this.groups.set(data))
    );
  }

  joinGroup(groupId: string) {
    return this.apiService.post<ApiResponse<any>>(`${this.baseUrl}/${groupId}/join/`, {}).pipe(
      map(res => res.object)
    );
  }

  leaveGroup(groupId: string) {
    return this.apiService.post<ApiResponse<any>>(`${this.baseUrl}/${groupId}/leave/`, {}).pipe(
      map(res => res.object)
    );
  }

  getMessages(groupId: string) {
    return this.apiService.get<ApiResponse<GroupMessage[]>>(`${this.baseUrl}/${groupId}/messages/`).pipe(
      map(res => res.object),
      tap(data => this.activeMessages.set(data))
    );
  }

  sendMessage(groupId: string, content: string, image?: string) {
    return this.apiService.post<ApiResponse<GroupMessage>>(`${this.baseUrl}/${groupId}/messages/`, { content, image }).pipe(
      map(res => res.object)
    );
  }

  connectToChat(groupId: string) {
    const key = `chat_${groupId}`;
    this.wsService.connect(`ws/chat/${groupId}/`, key);
    this.wsService.onMessage()
      .pipe(filter(msg => msg.key === key))
      .subscribe(msg => {
        if (msg.type === 'chat_message') {
          this.activeMessages.update(prev => [...prev, msg.data]);
        } else if (msg.type === 'user_typing') {
          this.updateTypingStatus(groupId, msg.full_name, msg.is_typing);
        }
      });
  }

  sendTypingStatus(groupId: string, isTyping: boolean) {
    this.wsService.send(`chat_${groupId}`, { type: 'typing', is_typing: isTyping });
  }

  private updateTypingStatus(groupId: string, fullName: string, isTyping: boolean) {
    this.typingUsers.update(prev => {
      const current = prev[groupId] || [];
      const updated = isTyping 
        ? [...new Set([...current, fullName])]
        : current.filter(u => u !== fullName);
      return { ...prev, [groupId]: updated };
    });
  }

  disconnectFromChat(groupId: string) {
    this.wsService.disconnect(`chat_${groupId}`);
  }
}
