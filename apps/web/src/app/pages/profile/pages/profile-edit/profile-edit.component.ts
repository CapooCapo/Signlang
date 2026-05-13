import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProfileService } from '../../../../core/services/profile.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Profile, User } from '../../../../core/models/user.model';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-profile-edit',
  templateUrl: 'profile-edit.component.html',
  styleUrls: ['profile-edit.component.scss'],
  standalone: false
})
export class ProfileEditComponent implements OnInit {
  private fb = inject(FormBuilder);
  private profileService = inject(ProfileService);
  private authService = inject(AuthService);
  private router = inject(Router);

  profileForm!: FormGroup;
  isLoading = signal<boolean>(false);
  isSaving = signal<boolean>(false);
  
  // Image previews
  avatarPreview = signal<string | null>(null);
  coverPreview = signal<string | null>(null);
  
  // Files to upload
  avatarFile: File | null = null;
  coverFile: File | null = null;

  ngOnInit() {
    this.initForm();
    this.loadCurrentData();
  }

  initForm() {
    this.profileForm = this.fb.group({
      full_name: ['', [Validators.required]],
      bio: [''],
      city: [''],
      website: [''],
      phone: ['']
    });
  }

  loadCurrentData() {
    const user = this.authService.currentUser();
    const profile = this.profileService.currentProfile();

    if (user && profile) {
      this.profileForm.patchValue({
        full_name: user.full_name,
        bio: profile.bio,
        city: profile.city,
        website: profile.website,
        phone: profile.phone
      });
      this.avatarPreview.set(user.avatar);
      this.coverPreview.set(profile.cover_image);
    } else {
      // If data is missing, fetch it
      this.isLoading.set(true);
      this.profileService.getMyProfile().pipe(
        finalize(() => this.isLoading.set(false))
      ).subscribe(profile => {
        const currentUser = this.authService.currentUser();
        if (currentUser) {
          this.profileForm.patchValue({
            full_name: currentUser.full_name,
            bio: profile.bio,
            city: profile.city,
            website: profile.website,
            phone: profile.phone
          });
          this.avatarPreview.set(currentUser.avatar);
          this.coverPreview.set(profile.cover_image);
        }
      });
    }
  }

  onFileSelected(event: any, field: 'avatar' | 'cover_image') {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (field === 'avatar') {
          this.avatarPreview.set(reader.result as string);
          this.avatarFile = file;
        } else {
          this.coverPreview.set(reader.result as string);
          this.coverFile = file;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSaving.set(true);
    const formData = new FormData();
    
    // Add form fields
    const values = this.profileForm.value;
    Object.keys(values).forEach(key => {
      if (values[key] !== null && values[key] !== undefined) {
        formData.append(key, values[key]);
      }
    });

    // Add files if selected
    if (this.avatarFile) {
      formData.append('avatar', this.avatarFile);
    }
    if (this.coverFile) {
      formData.append('cover_image', this.coverFile);
    }

    this.profileService.updateMyProfile(formData).pipe(
      finalize(() => this.isSaving.set(false))
    ).subscribe({
      next: (updatedProfile) => {
        // Update local auth state if name changed
        const user = this.authService.currentUser();
        if (user) {
          // Wait for auth state to refresh before navigating
          this.authService.loadMe().subscribe({
            next: () => this.router.navigate(['/profile']),
            error: () => this.router.navigate(['/profile'])
          });
        } else {
          this.router.navigate(['/profile']);
        }
      },
      error: (err) => {
        console.error('Error updating profile:', err);
        alert('Có lỗi xảy ra khi cập nhật thông tin.');
      }
    });
  }

  onCancel() {
    this.router.navigate(['/profile']);
  }
}
