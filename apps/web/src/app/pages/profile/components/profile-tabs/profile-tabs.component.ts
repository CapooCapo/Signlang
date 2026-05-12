import { Component, input, signal } from '@angular/core';
import { UserProfile } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-profile-tabs',
  templateUrl: './profile-tabs.component.html',
  styleUrls: ['./profile-tabs.component.scss'],
  standalone: false
})
export class ProfileTabsComponent {
  userProfile = input.required<UserProfile>();
  isOwnProfile = input<boolean>(false);
  activeTab = signal<string>('posts');

  setTab(tab: string) {
    this.activeTab.set(tab);
  }

  get canShowActivity(): boolean {
    return this.isOwnProfile() || this.userProfile().privacy_settings.show_activity;
  }

  get canShowGroups(): boolean {
    return this.isOwnProfile() || this.userProfile().privacy_settings.show_groups;
  }
}
