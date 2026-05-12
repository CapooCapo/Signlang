import { Component, inject, OnInit } from '@angular/core';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss'],
  standalone: false
})
export class GroupListComponent implements OnInit {
  private chatService = inject(ChatService);
  groups = this.chatService.groups;

  ngOnInit() {
    this.chatService.getGroups();
  }

  onJoin(groupId: string) {
    this.chatService.joinGroup(groupId).subscribe(() => {
      this.chatService.getGroups();
    });
  }

  onOpenChat(groupId: string) {
    this.chatService.openChat(groupId);
  }
}
