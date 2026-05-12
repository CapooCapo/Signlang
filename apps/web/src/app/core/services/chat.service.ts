import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { GroupChat, GroupMessage } from '../models/community.model';
import { WebsocketService } from './websocket.service';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private wsService = inject(WebsocketService);
  private apiUrl = `${environment.apiUrl}/community/groups`;

  groups = signal<GroupChat[]>([]);
  activeMessages = signal<GroupMessage[]>([]);
  typingUsers = signal<Record<string, string[]>>({}); // group_id -> [full_name]
  
  isDrawerOpen = signal(false);
  selectedGroupId = signal<string | null>(null);

  toggleDrawer() {
    this.isDrawerOpen.update(v => !v);
    if (this.isDrawerOpen() && this.groups().length === 0) {
      this.getGroups();
    }
  }

  openChat(groupId: string) {
    this.selectedGroupId.set(groupId);
    this.isDrawerOpen.set(true);
    this.getMessages(groupId);
    this.connectToChat(groupId);
  }

  getGroups() {
    return this.http.get<GroupChat[]>(`${this.apiUrl}/`).subscribe(data => {
      this.groups.set(data);
    });
  }

  joinGroup(groupId: string) {
    return this.http.post(`${this.apiUrl}/${groupId}/join/`, {});
  }

  leaveGroup(groupId: string) {
    return this.http.post(`${this.apiUrl}/${groupId}/leave/`, {});
  }

  getMessages(groupId: string) {
    return this.http.get<GroupMessage[]>(`${this.apiUrl}/${groupId}/messages/`).subscribe(data => {
      this.activeMessages.set(data);
    });
  }

  sendMessage(groupId: string, content: string, image?: string) {
    return this.http.post<GroupMessage>(`${this.apiUrl}/${groupId}/messages/`, { content, image });
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
