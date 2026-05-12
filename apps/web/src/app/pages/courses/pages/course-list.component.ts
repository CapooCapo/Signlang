import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CourseMarketplaceService } from '../services/course-marketplace.service';

@Component({
  selector: 'app-course-list',
  standalone: false,
  template: `
    <div class="marketplace animate-fade">
      <div class="container">
        <header class="marketplace__header">
          <h1 class="grad-text">Khám phá Khóa học</h1>
          <p>Tìm kiếm lộ trình chuyên nghiệp từ các trung tâm uy tín</p>
        </header>

        <div class="filters glass">
          <button class="filter-btn active">Tất cả</button>
          <button class="filter-btn">Cơ bản</button>
          <button class="filter-btn">Nâng cao</button>
          <button class="filter-btn">Online</button>
          <button class="filter-btn">Trực tiếp</button>
        </div>

        <div class="course-grid">
          @for (course of courses(); track course.id) {
            <div class="course-card glass-hover animate-fade" [routerLink]="['/courses', course.id]">
              <div class="course-card__thumb">
                <img [src]="course.thumbnail" [alt]="course.title">
                <div class="type-badge">{{ course.type }}</div>
              </div>
              <div class="course-card__content">
                <div class="header">
                  <span class="level">{{ course.level }}</span>
                  <span class="rating">⭐ {{ course.rating }}</span>
                </div>
                <h3>{{ course.title }}</h3>
                <p class="center">{{ course.centerName }}</p>
                
                <div class="footer">
                  <div class="stats">
                    <span>👥 {{ course.studentCount | number }} học viên</span>
                  </div>
                  <div class="price">{{ course.price | number }} {{ course.currency }}</div>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .marketplace {
      padding: 5rem 0;
      &__header {
        text-align: center;
        margin-bottom: 3rem;
        h1 { font-size: 3rem; margin-bottom: 0.5rem; }
        p { color: var(--text-muted); font-size: 1.2rem; }
      }
    }

    .filters {
      display: flex;
      gap: 1rem;
      padding: 1rem;
      border-radius: var(--radius);
      margin-bottom: 3rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .filter-btn {
      padding: 0.6rem 1.5rem;
      border-radius: 100px;
      background: rgba(255, 255, 255, 0.05);
      color: var(--text-muted);
      cursor: pointer;
      transition: var(--transition);
      &.active {
        background: var(--primary);
        color: white;
      }
      &:hover:not(.active) {
        background: rgba(255, 255, 255, 0.1);
      }
    }

    .course-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .course-card {
      border-radius: var(--radius);
      overflow: hidden;
      cursor: pointer;
      
      &__thumb {
        position: relative;
        height: 200px;
        img { width: 100%; height: 100%; object-fit: cover; }
        .type-badge {
          position: absolute;
          top: 1rem;
          right: 1rem;
          background: var(--accent);
          color: black;
          padding: 0.2rem 0.8rem;
          border-radius: 4px;
          font-size: 0.8rem;
          font-weight: 700;
        }
      }

      &__content {
        padding: 1.5rem;
        .header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 1rem;
          .level { color: var(--accent); font-weight: 600; font-size: 0.9rem; }
          .rating { color: #ffcc00; font-weight: 700; }
        }
        h3 { font-size: 1.25rem; margin-bottom: 0.5rem; line-height: 1.4; height: 3.5rem; overflow: hidden; }
        .center { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 1.5rem; }
        
        .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid var(--border);
          .stats { font-size: 0.85rem; color: var(--text-muted); }
          .price { color: var(--primary-light); font-weight: 700; font-size: 1.1rem; }
        }
      }
    }

    @media (max-width: 768px) {
      .course-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class CourseListComponent {
  private marketplaceService = inject(CourseMarketplaceService);
  courses = this.marketplaceService.courses;
}
