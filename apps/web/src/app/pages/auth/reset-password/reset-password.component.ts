import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-reset-password',
  standalone: false,
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <img src="/logo.png" alt="SignLang Logo" class="logo" />
          <h1>Đặt lại mật khẩu</h1>
          <p>Vui lòng nhập mật khẩu mới của bạn.</p>
        </div>

        <div *ngIf="successMessage" class="success-alert">
          <span class="icon">✅</span>
          <p>{{ successMessage }}</p>
          <button class="btn-link" routerLink="/login">Đăng nhập ngay</button>
        </div>

        <form *ngIf="!successMessage" [formGroup]="resetForm" (ngSubmit)="onSubmit()" class="login-form">
          <div class="form-group">
            <label for="password">Mật khẩu mới</label>
            <div class="input-wrapper" [class.error]="submitted && f['password'].invalid">
              <span class="icon">🔒</span>
              <input id="password" type="password" formControlName="password" placeholder="••••••••" />
            </div>
            <div *ngIf="submitted && f['password'].errors" class="error-message">
              <small *ngIf="f['password'].errors['required']">Vui lòng nhập mật khẩu.</small>
              <small *ngIf="f['password'].errors['minlength']">Mật khẩu phải có ít nhất 8 ký tự.</small>
            </div>
          </div>

          <div class="form-group">
            <label for="password_confirm">Xác nhận mật khẩu</label>
            <div class="input-wrapper" [class.error]="submitted && (f['password_confirm'].invalid || resetForm.errors?.['mismatch'])">
              <span class="icon">🛡️</span>
              <input id="password_confirm" type="password" formControlName="password_confirm" placeholder="••••••••" />
            </div>
            <div *ngIf="submitted && (f['password_confirm'].errors || resetForm.errors?.['mismatch'])" class="error-message">
              <small *ngIf="f['password_confirm'].errors?.['required']">Vui lòng xác nhận mật khẩu.</small>
              <small *ngIf="resetForm.errors?.['mismatch']">Mật khẩu không khớp.</small>
            </div>
          </div>

          <div *ngIf="errorMessage" class="server-error">
            {{ errorMessage }}
          </div>

          <button type="submit" class="btn-submit" [disabled]="loading">
            <span *ngIf="!loading">Cập nhật mật khẩu</span>
            <span *ngIf="loading" class="loader"></span>
          </button>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['../register/register.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  resetForm!: FormGroup;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  token = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    if (!this.token) {
      this.errorMessage = 'Mã xác minh không hợp lệ.';
    }

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirm: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('password_confirm')?.value
      ? null : { mismatch: true };
  }

  get f() { return this.resetForm.controls; }

  onSubmit(): void {
    this.submitted = true;
    if (this.resetForm.invalid || !this.token) return;

    this.loading = true;
    const data = {
      token: this.token,
      password: this.f['password'].value,
      password_confirm: this.f['password_confirm'].value
    };

    this.authService.resetPassword(data).subscribe({
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
