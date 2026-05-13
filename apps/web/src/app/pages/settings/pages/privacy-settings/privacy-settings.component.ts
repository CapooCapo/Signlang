import { Component, inject, OnInit } from '@angular/core';
import { ProfileService } from '../../../../core/services/profile.service';
import { PrivacySettings } from '../../../../core/models/user.model';

@Component({
  selector: 'app-privacy-settings',
  templateUrl: './privacy-settings.component.html',
  styleUrls: ['./privacy-settings.component.scss'],
  standalone: false
})
export class PrivacySettingsComponent implements OnInit {
  private profileService = inject(ProfileService);
  
  settings: PrivacySettings | null = null;
  isLoading = true;

  ngOnInit() {
    this.profileService.getMyPrivacy().subscribe(data => {
      this.settings = data;
      this.isLoading = false;
    });
  }

  onToggle(field: keyof PrivacySettings) {
    if (!this.settings) return;
    
    const update = { [field]: !this.settings[field] };
    this.profileService.updateMyPrivacy(update).subscribe(data => {
      this.settings = data;
    });
  }

  onVisibilityChange(value: 'PUBLIC' | 'PRIVATE') {
    if (!this.settings) return;
    this.profileService.updateMyPrivacy({ profile_visibility: value }).subscribe(data => {
      this.settings = data;
    });
  }
}
