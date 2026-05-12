import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: false,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
})
export class HomePageComponent implements OnInit {
  year = new Date().getFullYear();
  counters = [
    { label: 'Ký hiệu hỗ trợ', value: 50 },
    { label: 'Bài học video', value: 240 },
    { label: 'Người học active', value: 15800 },
  ];

  features = [
    {
      icon: '🤟',
      title: 'Nhận diện cử chỉ AI',
      desc: 'Công nghệ Computer Vision tiên tiến giúp nhận diện và chấm điểm cử chỉ tay theo thời gian thực.',
      img: 'assets/images/feature-recognition-new.png'
    },
    {
      icon: '📚',
      title: 'Lộ trình học tập cá nhân',
      desc: 'Hệ thống bài học được thiết kế khoa học giúp bạn nắm vững các ký tự và từ vựng cơ bản chỉ sau vài ngày.',
      img: 'assets/images/feature-learning-new.png'
    },
    {
      icon: '👥',
      title: 'Cộng đồng & Thi đua',
      desc: 'Tham gia các thử thách, học cùng bạn bè và thăng hạng trên bảng xếp hạng toàn cầu.',
      img: 'assets/images/feature-community-new.png'
    }
  ];

  faqs = [
    { q: 'Tôi có cần thiết bị đặc biệt nào không?', a: 'Chỉ cần một chiếc laptop hoặc smartphone có camera là bạn có thể bắt đầu học ngay.' },
    { q: 'Khóa học có dành cho người mới bắt đầu?', a: 'Hoàn toàn có thể. Chúng tôi bắt đầu từ những ký hiệu chữ cái cơ bản nhất.' },
    { q: 'Làm thế nào để đo lường sự tiến bộ?', a: 'Hệ thống AI sẽ chấm điểm độ chính xác của cử chỉ và cấp chứng chỉ sau mỗi khóa học.' }
  ];

  ngOnInit(): void { }
}
