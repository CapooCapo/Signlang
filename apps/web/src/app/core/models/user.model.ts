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

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  avatar: string | null;
  provider: string;
  profile?: Profile;
  privacy_settings?: PrivacySettings;
}

export interface AuthData {
  access: string;
  refresh: string;
  user: User;
}
