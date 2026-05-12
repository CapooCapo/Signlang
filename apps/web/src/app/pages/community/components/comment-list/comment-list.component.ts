import { Component, input, inject, OnInit } from '@angular/core';
import { CommunityService } from '../../../../core/services/community.service';
import { PostComment } from '../../../../core/models/community.model';

@Component({
  selector: 'app-comment-list',
  templateUrl: './comment-list.component.html',
  styleUrls: ['./comment-list.component.scss'],
  standalone: false
})
export class CommentListComponent implements OnInit {
  private communityService = inject(CommunityService);
  
  postId = input.required<string>();
  comments: PostComment[] = [];
  newComment = '';

  ngOnInit() {
    this.communityService.getComments(this.postId()).subscribe(data => {
      this.comments = data;
    });
  }

  onSubmit() {
    if (!this.newComment.trim()) return;

    this.communityService.addComment(this.postId(), this.newComment).subscribe(comment => {
      this.comments.push(comment);
      this.newComment = '';
    });
  }
}
