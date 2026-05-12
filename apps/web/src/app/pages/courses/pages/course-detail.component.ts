import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourseMarketplaceService } from '../services/course-marketplace.service';
import { MarketplaceCourse } from '../models/course-marketplace.model';

@Component({
  selector: 'app-course-detail',
  standalone: false,
  template: `
    @if (course()) {
      <div class="detail animate-fade">
        <!-- Hero Header -->
        <section class="detail__hero" [style.background-image]="'linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(' + course()!.thumbnail + ')'">
          <div class="container">
            <div class="hero-content">
              <span class="badge">{{ course()!.centerName }}</span>
              <h1>{{ course()!.title }}</h1>
              <div class="meta">
                <span>⭐ {{ course()!.rating }} Rating</span>
                <span>👥 {{ course()!.studentCount | number }} Học viên</span>
                <span>📍 {{ course()!.type }}</span>
              </div>
            </div>
          </div>
        </section>

        <div class="container main-layout">
          <main class="content">
            <section class="glass section">
              <h2>Mô tả khóa học</h2>
              <p>{{ course()!.description }}</p>
            </section>

            <section class="glass section">
              <h2>Nội dung khóa học (Syllabus)</h2>
              <ul class="syllabus">
                @for (item of course()!.syllabus; track item) {
                  <li>{{ item }}</li>
                } @empty {
                  <li>Thông tin đang được cập nhật...</li>
                }
              </ul>
            </section>

            <section class="glass section">
              <h2>Giảng viên</h2>
              <div class="instructor">
                <img [src]="course()!.instructor.avatar" [alt]="course()!.instructor.name">
                <div>
                  <h3>{{ course()!.instructor.name }}</h3>
                  <p>{{ course()!.instructor.bio }}</p>
                </div>
              </div>
            </section>
          </main>

          <aside class="sidebar">
            <div class="glass checkout-card">
              <div class="price-tag">
                <span class="label">Học phí:</span>
                <span class="price">{{ course()!.price | number }} {{ course()!.currency }}</span>
              </div>

              <div class="info-list">
                <div class="item"><span>⏱️ Thời lượng:</span> {{ course()!.duration }}</div>
                <div class="item"><span>📅 Lịch học:</span> {{ course()!.schedule }}</div>
                @if (course()!.address) {
                  <div class="item"><span>📍 Địa chỉ:</span> {{ course()!.address }}</div>
                }
              </div>

              <div class="actions">
                <button class="btn btn--primary">Đăng ký ngay</button>
                <div class="row">
                  <button class="btn btn--ghost flex-1">Chat tư vấn</button>
                  <a [href]="'tel:' + course()!.hotline" class="btn btn--ghost flex-1">📞 Hotline</a>
                </div>
              </div>
            </div>

            <div class="glass support-card">
              <h4>Cần hỗ trợ?</h4>
              <p>Liên hệ hotline: <strong>{{ course()!.hotline }}</strong></p>
            </div>
          </aside>
        </div>
      </div>
    }
  `,
  styles: [`
    .detail {
      &__hero {
        padding: 8rem 0 4rem;
        background-size: cover;
        background-position: center;
        margin-bottom: 3rem;
        .hero-content {
          max-width: 800px;
          h1 { font-size: 3.5rem; margin: 1rem 0; line-height: 1.2; }
          .meta { display: flex; gap: 2rem; color: var(--accent); font-weight: 600; }
          .badge { background: var(--primary); padding: 0.4rem 1rem; border-radius: 4px; font-weight: 700; }
        }
      }
    }

    .main-layout {
      display: grid;
      grid-template-columns: 1fr 380px;
      gap: 3rem;
      align-items: start;
      margin-bottom: 5rem;
    }

    .section {
      padding: 2.5rem;
      border-radius: var(--radius);
      margin-bottom: 2rem;
      h2 { margin-bottom: 1.5rem; border-left: 4px solid var(--accent); padding-left: 1rem; }
      p { line-height: 1.8; color: var(--text-muted); }
    }

    .syllabus {
      li { padding: 1rem; border-bottom: 1px solid var(--border); &:last-child { border: none; } }
    }

    .instructor {
      display: flex;
      gap: 1.5rem;
      img { width: 80px; height: 80px; border-radius: 50%; object-fit: cover; }
      h3 { margin-bottom: 0.5rem; }
      p { font-size: 0.95rem; }
    }

    .checkout-card {
      padding: 2rem;
      border-radius: var(--radius);
      position: sticky;
      top: 6rem;
      
      .price-tag {
        margin-bottom: 2rem;
        .label { display: block; color: var(--text-muted); font-size: 0.9rem; }
        .price { font-size: 2rem; font-weight: 800; color: var(--accent); }
      }

      .info-list {
        margin-bottom: 2rem;
        .item { padding: 0.8rem 0; border-bottom: 1px solid var(--border); font-size: 0.95rem; }
      }

      .actions {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        .row { display: flex; gap: 0.5rem; }
        .flex-1 { flex: 1; }
        button, a { width: 100%; }
      }
    }

    .support-card {
      margin-top: 1.5rem;
      padding: 1.5rem;
      text-align: center;
      border-radius: var(--radius);
      h4 { margin-bottom: 0.5rem; }
      p { font-size: 0.9rem; color: var(--text-muted); }
    }

    @media (max-width: 1024px) {
      .main-layout { grid-template-columns: 1fr; }
      .sidebar { order: -1; }
    }
  `]
})
export class CourseDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private marketplaceService = inject(CourseMarketplaceService);
  
  course = signal<MarketplaceCourse | undefined>(undefined);

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.course.set(this.marketplaceService.getCourseById(id));
    }
  }
}
