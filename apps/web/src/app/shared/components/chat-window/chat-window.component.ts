import { Component, input, inject, OnInit, OnDestroy, ViewChild, ElementRef, afterRenderEffect, signal } from '@angular/core';
import { ChatService } from '../../../core/services/chat.service';
import { GroupMessage } from '../../../core/models/community.model';

@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.scss'],
  standalone: false
})
export class ChatWindowComponent implements OnInit, OnDestroy {
  private chatService = inject(ChatService);
  
  groupId = input.required<string>();
  messages = this.chatService.activeMessages;
  typingUsers = this.chatService.typingUsers;
  
  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;
  
  newMessage = '';
  private typingTimeout: any;

  constructor() {
    afterRenderEffect(() => {
      this.scrollToBottom();
    });
  }

  ngOnInit() {
    this.chatService.getMessages(this.groupId());
    this.chatService.connectToChat(this.groupId());
  }

  ngOnDestroy() {
    this.chatService.disconnectFromChat(this.groupId());
  }

  onSend() {
    if (!this.newMessage.trim()) return;
    this.chatService.sendMessage(this.groupId(), this.newMessage).subscribe();
    this.newMessage = '';
    this.onTyping(false);
  }

  onTyping(isTyping: boolean) {
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    
    this.chatService.sendTypingStatus(this.groupId(), isTyping);
    
    if (isTyping) {
      this.typingTimeout = setTimeout(() => this.onTyping(false), 3000);
    }
  }

  private scrollToBottom(): void {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }
}
