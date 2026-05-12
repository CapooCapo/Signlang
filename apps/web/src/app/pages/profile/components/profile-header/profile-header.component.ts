import { Component, input, output } from '@angular/core';
import { UserProfile } from '../../../../core/services/profile.service';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.scss'],
  standalone: false
})
export class ProfileHeaderComponent {
  userProfile = input.required<UserProfile>();
  isOwnProfile = input<boolean>(false);
  edit = output<void>();
  share = output<void>();

  onEdit() {
    this.edit.emit();
  }

  onShare() {
    this.share.emit();
  }
}
