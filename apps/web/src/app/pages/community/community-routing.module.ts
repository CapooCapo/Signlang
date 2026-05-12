import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FeedComponent } from './pages/feed/feed.component';
import { GroupListComponent } from './pages/groups/group-list.component';
import { GroupDetailComponent } from './pages/group-detail/group-detail.component';

const routes: Routes = [
  { path: '', component: FeedComponent },
  { path: 'groups', component: GroupListComponent },
  { path: 'groups/:id', component: GroupDetailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CommunityRoutingModule { }
