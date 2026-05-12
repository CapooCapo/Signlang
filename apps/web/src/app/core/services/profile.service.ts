import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';

export interface PrivacySettings {
  show_activity: boolean;
  show_groups: boolean;
  show_learning_progress: boolean;
  profile_visibility: 'PUBLIC' | 'PRIVATE';
}

export interface Profile {
  email: string;
  full_name: string;
  bio: string;
  city: string;
  cover_image: string | null;
  avatar: string | null;
  website: string;
  phone: string;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: string;
  profile: Profile;
  privacy_settings: PrivacySettings;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/profiles`;

  currentProfile = signal<Profile | null>(null);
  currentPrivacy = signal<PrivacySettings | null>(null);

  getMyProfile(): Observable<Profile> {
    return this.http.get<Profile>(`${this.apiUrl}/user/me/`).pipe(
      tap(profile => this.currentProfile.set(profile))
    );
  }

  updateMyProfile(data: Partial<Profile & { full_name: string }>): Observable<Profile> {
    return this.http.patch<Profile>(`${this.apiUrl}/user/me/`, data).pipe(
      tap(profile => this.currentProfile.set(profile))
    );
  }

  getProfileByUsername(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/user/by_username/u/${username}/`);
  }

  getMyPrivacy(): Observable<PrivacySettings> {
    return this.http.get<PrivacySettings>(`${this.apiUrl}/privacy/me/`).pipe(
      tap(settings => this.currentPrivacy.set(settings))
    );
  }

  updateMyPrivacy(data: Partial<PrivacySettings>): Observable<PrivacySettings> {
    return this.http.patch<PrivacySettings>(`${this.apiUrl}/privacy/me/`, data).pipe(
      tap(settings => this.currentPrivacy.set(settings))
    );
  }
}
