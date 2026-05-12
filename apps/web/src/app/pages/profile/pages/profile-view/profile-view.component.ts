import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService, UserProfile } from '../../../../core/services/profile.service';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-view',
  templateUrl: './profile-view.component.html',
  styleUrls: ['./profile-view.component.scss'],
  standalone: false
})
export class ProfileViewComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);

  userProfile = signal<UserProfile | null>(null);
  isOwnProfile = signal<boolean>(false);
  isLoading = signal<boolean>(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.route.params.subscribe(params => {
      const username = params['username'];
      if (username) {
        this.loadProfile(username);
      } else {
        this.loadMyProfile();
      }
    });
  }

  loadMyProfile() {
    this.isLoading.set(true);
    this.profileService.getMyProfile().subscribe({
      next: (profile) => {
        // Construct UserProfile from MyProfile
        const user = this.authService.currentUser();
        if (user) {
          this.userProfile.set({
            id: user.id.toString(),
            email: user.email,
            full_name: user.full_name,
            role: user.role,
            profile: profile,
            privacy_settings: this.profileService.currentPrivacy() || {
              show_activity: true,
              show_groups: true,
              show_learning_progress: true,
              profile_visibility: 'PUBLIC'
            }
          });
          this.isOwnProfile.set(true);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Không thể tải thông tin cá nhân.');
        this.isLoading.set(false);
      }
    });
    
    // Also load privacy settings if missing
    if (!this.profileService.currentPrivacy()) {
      this.profileService.getMyPrivacy().subscribe();
    }
  }

  loadProfile(username: string) {
    this.isLoading.set(true);
    this.profileService.getProfileByUsername(username).subscribe({
      next: (profile) => {
        this.userProfile.set(profile);
        this.isOwnProfile.set(this.authService.currentUser()?.email === profile.email);
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Người dùng không tồn tại hoặc trang cá nhân đang ở chế độ riêng tư.');
        this.isLoading.set(false);
      }
    });
  }

  onEdit() {
    // Navigate to edit or open dialog
    console.log('Edit Profile');
  }

  onShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Đã sao chép liên kết trang cá nhân!');
    });
  }
}
