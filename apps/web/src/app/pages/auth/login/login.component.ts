import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  googleLoading = false;
  errorMessage: string | null = null;
  submitted = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  ngOnInit(): void {}

  loginWithGoogle() {
    this.googleLoading = true;
    this.errorMessage = null;
    this.authService.loginWithGoogle().subscribe({
      next: () => {
        this.googleLoading = false;
        this.router.navigate(['/course']);
      },
      error: (err: { message: string }) => {
        this.googleLoading = false;
        this.errorMessage = err.message || 'Đăng nhập Google thất bại. Vui lòng thử lại.';
      }
    });
  }

  // Clean getters for form controls
  get f() {
    return this.loginForm.controls;
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit() {
    this.submitted = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/course']);
      },
      error: (err: { message: string }) => {
        this.loading = false;
        // Handle server errors gracefully
        this.errorMessage = err.message || 'Đã có lỗi xảy ra. Vui lòng thử lại sau.';
      },
    });
  }
}
