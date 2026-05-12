import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-group-detail',
  templateUrl: './group-detail.component.html',
  styleUrls: ['./group-detail.component.scss'],
  standalone: false
})
export class GroupDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private chatService = inject(ChatService);
  
  groupId = this.route.snapshot.params['id'];
  group: any; // Ideally typed

  ngOnInit() {
    this.chatService.groups().forEach(g => {
      if (g.id === this.groupId) this.group = g;
    });
  }
}
