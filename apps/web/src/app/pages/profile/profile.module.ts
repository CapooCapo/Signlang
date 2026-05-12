import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProfileRoutingModule } from './profile-routing.module';
import { SharedModule } from '../../shared/shared.module';

// Pages
import { ProfileViewComponent } from './pages/profile-view/profile-view.component';

// Components
import { ProfileHeaderComponent } from './components/profile-header/profile-header.component';
import { ProfileTabsComponent } from './components/profile-tabs/profile-tabs.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';

@NgModule({
  declarations: [
    ProfileViewComponent,
    ProfileHeaderComponent,
    ProfileTabsComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProfileModule { }
