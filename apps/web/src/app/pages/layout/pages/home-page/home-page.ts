import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  year = new Date().getFullYear();
  counters = [
    { label: 'Ngôn ngữ ký hiệu', value: 32 },
    { label: 'Bài học tương tác', value: 180 },
    { label: 'Người học hoạt động', value: 12450 },
  ];

  features = [
    {
      icon: '🤟',
      title: 'Nhận diện ký hiệu thời gian thực',
      desc: 'Dùng webcam để nhận diện cử chỉ tay và phản hồi tức thì cho người học.',
      img: 'assets/images/feature-recognition.webp'
    },
    {
      icon: '📚',
      title: 'Lộ trình học thông minh',
      desc: 'Bài học từ cơ bản đến nâng cao, kèm quiz và flashcards để ghi nhớ nhanh.',
      img: 'assets/images/feature-learning.webp'
    },
    {
      icon: '👥',
      title: 'Cộng đồng luyện tập',
      desc: 'Tạo nhóm, học cùng bạn bè, thi đua theo bảng xếp hạng hàng tuần.',
      img: 'assets/images/feature-community.webp'
    }
  ];

  faqs = [
    { q: 'Có cần cài ứng dụng không?', a: 'Không. Truy cập trên trình duyệt là đủ. Webcam là tùy chọn cho nhận diện.' },
    { q: 'Hỗ trợ thiết bị nào?', a: 'Máy tính để bàn, laptop, và điện thoại hiện đại. Trang responsive đầy đủ.' },
    { q: 'Dữ liệu cá nhân an toàn chứ?', a: 'Dữ liệu học tập được bảo vệ. Chỉ dùng camera khi bạn bật.' }
  ];

  ngOnInit(): void {}
}
