import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: false,
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/logo.png" alt="SignLang Logo" class="logo" />
          <h1>Quên mật khẩu?</h1>
          <p>Nhập email của bạn và chúng tôi sẽ gửi liên kết để đặt lại mật khẩu.</p>
        </div>

        <div *ngIf="successMessage" class="success-alert">
          <span class="icon">📧</span>
          <p>{{ successMessage }}</p>
          <button class="btn-link" routerLink="/login">Quay lại đăng nhập</button>
        </div>

        <form *ngIf="!successMessage" [formGroup]="forgotForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="email">Email</label>
            <div class="input-wrapper" [class.error]="submitted && f['email'].invalid">
              <span class="icon">📧</span>
              <input id="email" type="email" formControlName="email" placeholder="example@email.com" />
            </div>
            <div *ngIf="submitted && f['email'].errors" class="error-message">
              <small *ngIf="f['email'].errors['required']">Vui lòng nhập email.</small>
              <small *ngIf="f['email'].errors['email']">Email không đúng định dạng.</small>
            </div>
          </div>

          <div *ngIf="errorMessage" class="server-error">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            <span *ngIf="!loading">Gửi yêu cầu</span>
            <span *ngIf="loading" class="loader"></span>
          </button>

          <div class="login-footer">
            <a routerLink="/login" class="forgot-link">Quay lại đăng nhập</a>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../register/register.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  forgotForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';

  constructor(private fb: FormBuilder, private authService: AuthService) {}

  ngOnInit(): void {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  get f() { return this.forgotForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.forgotForm.invalid) return;

    this.loading = true;
    this.authService.forgotPassword(this.f['email'].value).subscribe({
      next: (res: { message: string }) => {
        this.loading = false;
        this.successMessage = res.message;
      },
      error: (err: { message: string }) => {
        this.loading = false;
        this.errorMessage = err.message || 'Có lỗi xảy ra.';
      }
    });
  }
}
