import { Component, inject } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';

@Component({
  selector: 'app-chat-drawer',
  templateUrl: './chat-drawer.component.html',
  styleUrls: ['./chat-drawer.component.scss'],
  standalone: false
})
export class ChatDrawerComponent {
  public chatService = inject(ChatService);

  selectGroup(groupId: string) {
    this.chatService.openChat(groupId);
  }

  close() {
    this.chatService.isDrawerOpen.set(false);
  }
}
