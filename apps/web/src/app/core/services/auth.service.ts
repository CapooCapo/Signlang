import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, from, switchMap, tap, catchError, of } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Auth, signInWithPopup, GoogleAuthProvider, authState, UserCredential } from '@angular/fire/auth';
import { inject } from '@angular/core';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: string;
  avatar: string;
  provider: string;
}

export interface AuthData {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthResponse {
  status: number;
  message: string;
  object: AuthData;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  
  accessToken = signal<string | null>(null);
  currentUser = signal<User | null>(null);

  private auth: Auth = inject(Auth);
  
  constructor(
    private apiService: ApiService, 
    private router: Router
  ) {
    this.loadUserFromStorage();
    this.monitorAuthState();
    if (this.isAuthenticated) {
      this.loadMe().subscribe();
    }
  }

  loadMe(): Observable<User> {
    return this.apiService.get<User>('/auth/me/').pipe(
      tap(user => {
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
      catchError(err => {
        if (err.status === 401) this.clearStorage();
        throw err;
      })
    );
  }

  private monitorAuthState() {
    authState(this.auth).subscribe(user => {
      console.log('Firebase Auth State:', user ? `Logged in as ${user.email}` : 'Logged out');
    });
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login/', credentials).pipe(
      tap((response) => {
        if (response.status === 200 && response.object) {
          this.handleAuthSuccess(response.object);
        }
      })
    );
  }

  loginWithGoogle(): Observable<AuthResponse> {
    console.log('Starting Google Login flow (Modular SDK)...');
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((result: UserCredential) => {
        if (!result.user) {
          console.error('CRITICAL: Firebase user is missing from login result.');
          throw new Error('Không lấy được thông tin người dùng từ Firebase');
        }

        console.log('--- [DEBUG] Retrieving Firebase ID Token ---');
        return from(result.user.getIdToken());
      }),
      tap(idToken => {
        console.log('--- [DEBUG] Backend Request Payload ---');
        console.log('Payload:', JSON.stringify({ token: idToken }, null, 2));
        console.log('Sending token to backend endpoint: /auth/google/');
      }),
      switchMap(idToken => 
        this.apiService.post<AuthResponse>('/auth/google/', { token: idToken })
      ),
      tap((response) => {
        if (response.status === 200 && response.object) {
          console.log('Backend authentication successful:', response.object);
          this.handleAuthSuccess(response.object);
        } else {
          console.error('Backend authentication failed. Status:', response.status, 'Message:', response.message);
        }
      }),
      catchError(err => {
        console.error('--- [DEBUG] Google Login Error ---');
        console.error('Error Details:', err);
        throw err;
      })
    );
  }

  register(data: RegisterRequest): Observable<any> {
    return this.apiService.post<any>('/auth/register/', data);
  }

  verifyAccount(token: string): Observable<any> {
    return this.apiService.post('/auth/verify/', { token });
  }

  forgotPassword(email: string): Observable<any> {
    return this.apiService.post('/auth/forgot-password/', { email });
  }

  resetPassword(data: ResetPasswordRequest): Observable<any> {
    return this.apiService.post<any>('/auth/reset-password/', data);
  }

  logout() {
    console.log('Logging out...');
    from(this.auth.signOut()).subscribe(() => {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        this.apiService.post('/auth/logout/', { refresh }).subscribe({
          next: () => this.clearStorage(),
          error: () => this.clearStorage()
        });
      } else {
        this.clearStorage();
      }
    });
  }

  private clearStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.accessToken.set(null);
    this.currentUser.set(null);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }

  get isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  private handleAuthSuccess(data: AuthData) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.accessToken.set(data.access);
    this.currentUser.set(data.user);
    this.currentUserSubject.next(data.user);
  }

  private loadUserFromStorage() {
    const access = localStorage.getItem('access_token');
    const userJson = localStorage.getItem('user');
    if (access) this.accessToken.set(access);
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.currentUser.set(user);
        this.currentUserSubject.next(user);
      } catch (e) {
        this.clearStorage();
      }
    }
  }
}
