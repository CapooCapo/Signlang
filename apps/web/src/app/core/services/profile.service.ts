import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, map } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse } from '../models/api-response.model';
import { Profile, PrivacySettings, User } from '../models/user.model';

// UserProfile is basically a User with required profile/privacy
export type UserProfile = User & { profile: Profile; privacy_settings: PrivacySettings };

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private apiService = inject(ApiService);
  private readonly baseUrl = '/profiles';

  currentProfile = signal<Profile | null>(null);
  currentPrivacy = signal<PrivacySettings | null>(null);

  getMyProfile(): Observable<Profile> {
    return this.apiService.get<ApiResponse<Profile>>(`${this.baseUrl}/user/me/`).pipe(
      map(res => res.object),
      tap(profile => this.currentProfile.set(profile))
    );
  }

  updateMyProfile(data: FormData | Partial<Profile & { full_name: string }>): Observable<Profile> {
    return this.apiService.patch<ApiResponse<Profile>>(`${this.baseUrl}/user/me/`, data).pipe(
      map(res => res.object),
      tap(profile => this.currentProfile.set(profile))
    );
  }

  getProfileByUsername(username: string): Observable<UserProfile> {
    return this.apiService.get<ApiResponse<UserProfile>>(`${this.baseUrl}/user/by_username/u/${username}/`).pipe(
      map(res => res.object)
    );
  }

  getMyPrivacy(): Observable<PrivacySettings> {
    return this.apiService.get<ApiResponse<PrivacySettings>>(`${this.baseUrl}/privacy/me/`).pipe(
      map(res => res.object),
      tap(settings => this.currentPrivacy.set(settings))
    );
  }

  updateMyPrivacy(data: Partial<PrivacySettings>): Observable<PrivacySettings> {
    return this.apiService.patch<ApiResponse<PrivacySettings>>(`${this.baseUrl}/privacy/me/`, data).pipe(
      map(res => res.object),
      tap(settings => this.currentPrivacy.set(settings))
    );
  }
}
