import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: false,
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/logo.png" alt="SignLang Logo" class="logo" />
          <h1>Xác minh tài khoản</h1>
        </div>

        <div *ngIf="loading" class="status-container">
          <div class="loader-large"></div>
          <p>Đang xác minh tài khoản của bạn...</p>
        </div>

        <div *ngIf="!loading && success" class="status-container success">
          <span class="icon">✅</span>
          <h2>Thành công!</h2>
          <p>{{ message }}</p>
          <button class="btn-submit" routerLink="/login">Đăng nhập ngay</button>
        </div>

        <div *ngIf="!loading && !success" class="status-container error">
          <span class="icon">❌</span>
          <h2>Thất bại</h2>
          <p>{{ message }}</p>
          <button class="btn-submit" routerLink="/register">Đăng ký lại</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .status-container {
      text-align: center;
      padding: 20px 0;
      
      p { color: #94a3b8; margin: 16px 0; }
      h2 { color: #fff; margin-bottom: 8px; }
      
      &.success .icon { font-size: 64px; display: block; margin-bottom: 24px; }
      &.error .icon { font-size: 64px; display: block; margin-bottom: 24px; }
    }
    
    .loader-large {
      width: 48px;
      height: 48px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: #3b82f6;
      border-radius: 50%;
      margin: 0 auto 24px;
      animation: spin 1s linear infinite;
    }

    .btn-submit {
      width: 100%;
      padding: 14px;
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      border: none;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      cursor: pointer;
      margin-top: 24px;
    }

    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class VerifyComponent implements OnInit {
  loading = true;
  success = false;
  message = '';

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    if (!token) {
      this.loading = false;
      this.success = false;
      this.message = 'Mã xác minh không hợp lệ hoặc đã hết hạn.';
      return;
    }

    this.authService.verifyAccount(token).subscribe({
      next: (res: any) => {
        this.loading = false;
        this.success = true;
        this.message = res.message;
      },
      error: (err: any) => {
        this.loading = false;
        this.success = false;
        this.message = err.error?.message || 'Không thể xác minh tài khoản.';
      }
    });
  }
}
