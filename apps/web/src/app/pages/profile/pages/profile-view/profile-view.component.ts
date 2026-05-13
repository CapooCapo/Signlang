import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  private router = inject(Router);
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
            ...user,
            avatar: profile.avatar || user.avatar,
            full_name: profile.full_name || user.full_name,
            profile: profile,
            privacy_settings: this.profileService.currentPrivacy() || {
              show_activity: true,
              show_groups: true,
              show_learning_progress: true,
              profile_visibility: 'PUBLIC'
            }
          } as UserProfile);
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
    this.router.navigate(['/profile/edit']);
  }

  onUpload(event: { file: File, field: 'avatar' | 'cover_image' }) {
    const formData = new FormData();
    formData.append(event.field, event.file);

    this.isLoading.set(true);
    this.profileService.updateMyProfile(formData).subscribe({
      next: (updatedProfile) => {
        const current = this.userProfile();
        if (current) {
          this.userProfile.set({
            ...current,
            profile: updatedProfile,
            avatar: event.field === 'avatar' ? updatedProfile.avatar : current.avatar
          } as UserProfile);
        }
        
        // Refresh global auth state so navbar avatar updates
        if (event.field === 'avatar') {
          this.authService.loadMe().subscribe();
        }
        
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Không thể tải ảnh lên. Vui lòng thử lại.');
        this.isLoading.set(false);
      }
    });
  }

  onShare() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      alert('Đã sao chép liên kết trang cá nhân!');
    });
  }
}
