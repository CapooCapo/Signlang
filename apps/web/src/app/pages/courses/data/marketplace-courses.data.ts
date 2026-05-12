import { MarketplaceCourse } from '../models/course-marketplace.model';

export const MARKETPLACE_COURSES: MarketplaceCourse[] = [
  {
    id: 'm1',
    title: 'Ngôn ngữ ký hiệu căn bản cho người mới bắt đầu',
    centerName: 'Trung tâm SignTalk',
    description: 'Khóa học tập trung vào các kỹ năng giao tiếp cơ bản nhất trong đời sống hàng ngày.',
    thumbnail: 'https://images.unsplash.com/photo-1516534775068-ba3e84529519?auto=format&fit=crop&q=80&w=800',
    price: 1500000,
    currency: 'VNĐ',
    level: 'Beginner',
    type: 'Online',
    rating: 4.8,
    studentCount: 1250,
    duration: '8 tuần (24 buổi)',
    schedule: 'Tối Thứ 2-4-6 (19:00 - 21:00)',
    hotline: '0901-234-567',
    instructor: {
      name: 'Cô Nguyễn Thị Lan',
      bio: '10 năm kinh nghiệm giảng dạy ngôn ngữ ký hiệu tại các trường chuyên biệt.',
      avatar: 'https://i.pravatar.cc/150?u=lan'
    },
    syllabus: [
      'Bài 1: Giới thiệu về cộng đồng Người Điếc',
      'Bài 2: Bảng chữ cái và số đếm',
      'Bài 3: Các đại từ nhân xưng',
      'Bài 4: Chủ đề Gia đình'
    ],
    faqs: [
      { q: 'Khóa học có cấp chứng chỉ không?', a: 'Có, trung tâm cấp chứng chỉ hoàn thành khóa học sau khi vượt qua bài kiểm tra cuối khóa.' }
    ],
    reviews: [
      { user: 'Hoàng Nam', rating: 5, comment: 'Cô dạy rất nhiệt tình, dễ hiểu.', date: '2024-05-01' }
    ]
  },
  {
    id: 'm2',
    title: 'Giao tiếp Ngôn ngữ ký hiệu Nâng cao',
    centerName: 'Học viện Ánh Sao',
    description: 'Nâng cao khả năng biểu đạt cảm xúc và các cấu trúc câu phức tạp.',
    thumbnail: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&q=80&w=800',
    price: 2200000,
    currency: 'VNĐ',
    level: 'Intermediate',
    type: 'Hybrid',
    rating: 4.9,
    studentCount: 850,
    duration: '10 tuần',
    schedule: 'Sáng Thứ 7 & Chủ Nhật',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    hotline: '0988-777-666',
    instructor: {
      name: 'Thầy Trần Văn Bình',
      bio: 'Chuyên gia ngôn ngữ học, thông dịch viên ngôn ngữ ký hiệu quốc tế.',
      avatar: 'https://i.pravatar.cc/150?u=binh'
    },
    syllabus: [
      'Bài 1: Ôn tập kiến thức căn bản',
      'Bài 2: Các thành ngữ trong ngôn ngữ ký hiệu',
      'Bài 3: Biểu đạt cảm xúc qua gương mặt'
    ],
    faqs: [],
    reviews: []
  },
  {
    id: 'm3',
    title: 'Khóa học Fingerspelling cấp tốc',
    centerName: 'SignLang Center',
    description: 'Làm chủ bảng chữ cái và cách đánh vần tên, địa danh trong 2 tuần.',
    thumbnail: 'https://images.unsplash.com/photo-1475721027785-f74dea327912?auto=format&fit=crop&q=80&w=800',
    price: 500000,
    currency: 'VNĐ',
    level: 'Beginner',
    type: 'Online',
    rating: 4.7,
    studentCount: 3200,
    duration: '2 tuần',
    schedule: 'Video học sẵn + 2 buổi Zoom live',
    hotline: '1900-5656',
    instructor: {
      name: 'Team SignLang',
      bio: 'Đội ngũ giáo viên trẻ trung, năng động.',
      avatar: 'https://i.pravatar.cc/150?u=team'
    },
    syllabus: [
      'Bảng chữ cái ASL',
      'Bảng chữ cái tiếng Việt',
      'Quy tắc đánh vần nhanh'
    ],
    faqs: [],
    reviews: []
  },
  {
    id: 'm4',
    title: 'Luyện thi chứng chỉ Ngôn ngữ ký hiệu Level 1',
    centerName: 'Trung tâm SignTalk',
    description: 'Lộ trình bám sát khung năng lực quốc gia.',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&q=80&w=800',
    price: 1800000,
    currency: 'VNĐ',
    level: 'Beginner',
    type: 'Offline',
    rating: 4.6,
    studentCount: 450,
    duration: '12 tuần',
    schedule: 'Chiều Thứ 3-5',
    address: '456 Đường CMT8, Quận 3, TP.HCM',
    hotline: '0901-234-567',
    instructor: {
      name: 'Cô Lan Anh',
      bio: 'Giảng viên khoa giáo dục đặc biệt.',
      avatar: 'https://i.pravatar.cc/150?u=lananh'
    },
    syllabus: [],
    faqs: [],
    reviews: []
  },
  {
    id: 'm5',
    title: 'Kỹ năng thông dịch Ngôn ngữ ký hiệu',
    centerName: 'Học viện Ánh Sao',
    description: 'Dành cho những bạn muốn trở thành thông dịch viên chuyên nghiệp.',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800',
    price: 4500000,
    currency: 'VNĐ',
    level: 'Advanced',
    type: 'Online',
    rating: 5.0,
    studentCount: 120,
    duration: '6 tháng',
    schedule: 'Tối Thứ 7',
    hotline: '0988-777-666',
    instructor: {
      name: 'Thầy Minh Đức',
      bio: 'Cố vấn ngôn ngữ cho các đài truyền hình.',
      avatar: 'https://i.pravatar.cc/150?u=duc'
    },
    syllabus: [],
    faqs: [],
    reviews: []
  },
  {
    id: 'm6',
    title: 'Ngôn ngữ ký hiệu cho Trẻ em',
    centerName: 'KidsSign Academy',
    description: 'Học qua trò chơi và bài hát, giúp bé phát triển tư duy ngôn ngữ sớm.',
    thumbnail: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800',
    price: 1200000,
    currency: 'VNĐ',
    level: 'Beginner',
    type: 'Offline',
    rating: 4.8,
    studentCount: 600,
    duration: '8 tuần',
    schedule: 'Sáng Chủ Nhật',
    address: '789 Đường Võ Văn Kiệt, Quận 5, TP.HCM',
    hotline: '0909-999-888',
    instructor: {
      name: 'Cô Mai',
      bio: 'Yêu trẻ, giàu kinh nghiệm giáo dục mầm non.',
      avatar: 'https://i.pravatar.cc/150?u=mai'
    },
    syllabus: [],
    faqs: [],
    reviews: []
  }
];
