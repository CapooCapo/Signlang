export interface MarketplaceCourse {
  id: string;
  title: string;
  centerName: string;
  description: string;
  thumbnail: string;
  price: number;
  currency: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  type: 'Online' | 'Offline' | 'Hybrid';
  rating: number;
  studentCount: number;
  duration: string;
  schedule: string;
  address?: string;
  hotline: string;
  instructor: {
    name: string;
    bio: string;
    avatar: string;
  };
  syllabus: string[];
  faqs: { q: string; a: string }[];
  reviews: { user: string; rating: number; comment: string; date: string }[];
}

export interface Center {
  id: string;
  name: string;
  logo: string;
  isOnline: boolean;
}
