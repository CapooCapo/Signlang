export interface UserMinimal {
  id: string;
  full_name: string;
  avatar?: string;
  role: string;
}

export type PostType = 'NORMAL_POST' | 'COURSE_PROMOTION' | 'QUESTION' | 'EVENT' | 'SEEKING_PARTNER' | 'ANNOUNCEMENT';

export interface CommunityPost {
  id: string;
  author: UserMinimal;
  content: string;
  post_type: PostType;
  image?: string;
  title?: string;
  price?: number;
  center_name?: string;
  hotline?: string;
  schedule?: string;
  address?: string;
  website?: string;
  created_at: string;
  updated_at: string;
  comment_count: number;
  reaction_counts: Record<string, number>;
  user_reaction?: string;
}

export interface PostComment {
  id: string;
  author: UserMinimal;
  content: string;
  created_at: string;
}

export interface GroupChat {
  id: string;
  name: string;
  description: string;
  image?: string;
  member_count: number;
  is_member: boolean;
  user_role?: 'ADMIN' | 'MODERATOR' | 'MEMBER';
  is_owner?: boolean;
  created_at: string;
}

export interface GroupMessage {
  id: string;
  author: UserMinimal;
  content: string;
  image?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  sender: UserMinimal;
  notification_type: string;
  post?: string;
  group?: string;
  is_read: boolean;
  created_at: string;
}
