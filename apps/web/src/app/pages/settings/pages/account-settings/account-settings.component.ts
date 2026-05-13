import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { Profile } from '../../../../core/models/user.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-settings',
  templateUrl: './account-settings.component.html',
  styleUrls: ['./account-settings.component.scss'],
  standalone: false
})
export class AccountSettingsComponent implements OnInit {
  private profileService = inject(ProfileService);
  private fb = inject(FormBuilder);

  profileForm!: FormGroup;
  isLoading = true;
  isSaving = false;

  ngOnInit() {
    this.profileService.getMyProfile().subscribe(profile => {
      this.initForm(profile);
      this.isLoading = false;
    });
  }

  initForm(profile: Profile) {
    this.profileForm = this.fb.group({
      full_name: [profile.full_name, [Validators.required]],
      bio: [profile.bio],
      city: [profile.city],
      website: [profile.website],
      phone: [profile.phone]
    });
  }

  onSubmit() {
    if (this.profileForm.invalid) return;

    this.isSaving = true;
    this.profileService.updateMyProfile(this.profileForm.value).subscribe({
      next: () => {
        this.isSaving = false;
        alert('Đã cập nhật thông tin thành công!');
      },
      error: () => {
        this.isSaving = false;
        alert('Có lỗi xảy ra.');
      }
    });
  }
}
