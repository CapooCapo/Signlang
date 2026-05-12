import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommunityRoutingModule } from './community-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Pages
import { FeedComponent } from './pages/feed/feed.component';
import { GroupListComponent } from './pages/groups/group-list.component';
import { GroupDetailComponent } from './pages/group-detail/group-detail.component';

// Components
import { PostCardComponent } from './components/post-card/post-card.component';
import { CommentListComponent } from './components/comment-list/comment-list.component';

@NgModule({
  declarations: [
    FeedComponent,
    GroupListComponent,
    GroupDetailComponent,
    PostCardComponent,
    CommentListComponent
  ],
  imports: [
    CommonModule,
    CommunityRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class CommunityModule { }
