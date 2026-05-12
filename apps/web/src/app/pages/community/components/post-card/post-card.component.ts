import { Component, input, output, inject } from '@angular/core';
import { CommunityPost } from '../../../../core/models/community.model';
import { CommunityService } from '../../../../core/services/community.service';

@Component({
  selector: 'app-post-card',
  templateUrl: './post-card.component.html',
  styleUrls: ['./post-card.component.scss'],
  standalone: false
})
export class PostCardComponent {
  private communityService = inject(CommunityService);
  
  post = input.required<CommunityPost>();
  showComments = false;

  onReact(type: string) {
    this.communityService.react(this.post().id, type).subscribe();
  }

  toggleLike() {
    this.onReact('LIKE');
  }

  toggleComments() {
    this.showComments = !this.showComments;
  }

  get isPromotion(): boolean {
    return this.post().post_type === 'COURSE_PROMOTION';
  }
}
