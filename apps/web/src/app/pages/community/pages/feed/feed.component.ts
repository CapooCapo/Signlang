import { Component, inject, OnInit } from '@angular/core';
import { CommunityService } from '../../../../core/services/community.service';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'app-community-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.scss'],
  standalone: false
})
export class FeedComponent implements OnInit {
  private communityService = inject(CommunityService);
  private chatService = inject(ChatService);
  
  posts = this.communityService.posts;
  groups = this.chatService.groups;
  
  newPostContent = '';
  isCreatingPost = false;

  ngOnInit() {
    this.communityService.getPosts();
    this.chatService.getGroups();
  }

  onCreatePost() {
    if (!this.newPostContent.trim()) return;
    
    this.communityService.createPost({
      content: this.newPostContent,
      post_type: 'NORMAL_POST'
    }).subscribe(() => {
      this.newPostContent = '';
      this.isCreatingPost = false;
    });
  }
}
