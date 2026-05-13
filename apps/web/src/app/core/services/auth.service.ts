import { Injectable, signal, inject, computed } from '@angular/core';
import { BehaviorSubject, Observable, from, switchMap, tap, catchError, of, map, finalize } from 'rxjs';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { Auth, signInWithPopup, GoogleAuthProvider, authState, UserCredential } from '@angular/fire/auth';
import { User, AuthData } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';

export type AuthResponse = ApiResponse<AuthData>;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Centralized state using BehaviorSubjects
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  private accessTokenSignal = signal<string | null>(null);
  
  // Public observable streams
  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();
  
  // Signals for template convenience
  public currentUser = signal<User | null>(null);
  public isAuthReady = signal<boolean>(false);
  public accessToken = computed(() => this.accessTokenSignal());

  private auth: Auth = inject(Auth);
  private apiService = inject(ApiService);
  private router = inject(Router);
  
  constructor() {
    // Initial load from storage to prevent flickering
    this.loadUserFromStorage();
    this.monitorFirebaseState();
  }

  /**
   * Explicit bootstrap lifecycle called by APP_INITIALIZER.
   * Ensures the auth state is fully resolved before the app renders.
   */
  initializeAuth(): Observable<void> {
    if (!this.getAccessToken()) {
      this.isAuthReady.set(true);
      return of(undefined);
    }

    return this.loadMe().pipe(
      map(() => undefined),
      catchError(() => of(undefined)),
      finalize(() => this.isAuthReady.set(true))
    );
  }

  loadMe(): Observable<User> {
    return this.apiService.get<ApiResponse<User>>('/auth/me/').pipe(
      map(response => response.object),
      tap(user => this.updateState(user)),
      catchError(err => {
        if (err.status === 401) {
          this.clearStorage();
        }
        throw err;
      })
    );
  }

  private monitorFirebaseState() {
    authState(this.auth).subscribe(user => {
      if (user) {
        console.debug('[Auth] Firebase user detected:', user.email);
      }
    });
  }

  login(credentials: { email: string; password: string }): Observable<AuthResponse> {
    return this.apiService.post<AuthResponse>('/auth/login/', credentials).pipe(
      tap((response) => {
        if (response.success && response.object) {
          this.handleAuthSuccess(response.object);
        }
      })
    );
  }

  loginWithGoogle(): Observable<AuthResponse> {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');

    return from(signInWithPopup(this.auth, provider)).pipe(
      switchMap((result: UserCredential) => from(result.user.getIdToken())),
      switchMap(idToken => this.apiService.post<AuthResponse>('/auth/google/', { token: idToken })),
      tap((response) => {
        if (response.success && response.object) {
          this.handleAuthSuccess(response.object);
        }
      })
    );
  }

  register(data: any): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/auth/register/', data);
  }

  verifyAccount(token: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/auth/verify/', { token });
  }

  forgotPassword(email: string): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/auth/forgot-password/', { email });
  }

  resetPassword(data: any): Observable<ApiResponse<any>> {
    return this.apiService.post<ApiResponse<any>>('/auth/reset-password/', data);
  }

  logout() {
    const refresh = localStorage.getItem('refresh_token');
    const finalLogout = () => {
      this.clearStorage();
      this.router.navigate(['/login']);
    };

    if (refresh) {
      this.apiService.post('/auth/logout/', { refresh }).pipe(
        finalize(() => finalLogout())
      ).subscribe();
    } else {
      finalLogout();
    }
    
    from(this.auth.signOut()).subscribe();
  }

  private handleAuthSuccess(data: AuthData) {
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    localStorage.setItem('user', JSON.stringify(data.user));
    this.accessTokenSignal.set(data.access);
    this.updateState(data.user);
  }

  private updateState(user: User | null) {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(!!user);
    this.currentUser.set(user);
  }

  private loadUserFromStorage() {
    const access = localStorage.getItem('access_token');
    const userJson = localStorage.getItem('user');
    if (access) this.accessTokenSignal.set(access);
    if (userJson) {
      try {
        const user = JSON.parse(userJson);
        this.updateState(user);
      } catch (e) {
        this.clearStorage();
      }
    }
  }

  private clearStorage() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    this.accessTokenSignal.set(null);
    this.updateState(null);
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
