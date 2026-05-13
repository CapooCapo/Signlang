import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs';

/**
 * Modern Functional Guest Guard.
 * Prevents authenticated users from accessing guest-only routes (e.g., Login, Register).
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuthenticated => {
      if (!isAuthenticated) {
        return true;
      }

      // Already logged in, redirect to home
      router.navigate(['/']);
      return false;
    })
  );
};
