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
  upload = output<{ file: File, field: 'avatar' | 'cover_image' }>();

  onEdit() {
    this.edit.emit();
  }

  onShare() {
    this.share.emit();
  }

  onFileSelected(event: any, field: 'avatar' | 'cover_image') {
    const file = event.target.files?.[0];
    if (file) {
      this.upload.emit({ file, field });
    }
  }
}
