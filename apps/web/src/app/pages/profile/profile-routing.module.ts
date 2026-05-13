import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfileViewComponent } from './pages/profile-view/profile-view.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';

const routes: Routes = [
  { path: '', component: ProfileViewComponent, pathMatch: 'full' },
  { path: 'edit', component: ProfileEditComponent },
  { path: ':username', component: ProfileViewComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
