import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import {catchError, of, switchMap} from 'rxjs';
import {AuthService} from '../services/auth.service';

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
  const router: Router = inject(Router);
  const authService = inject(AuthService);

  // Check if the user is already in the login page to avoid redirect loop
  if (state.url.includes('/login')) {
    return of(true); // Allow access to login page
  }

  // Check the authentication status
  return authService.check().pipe(
    switchMap((authenticated) => {
      // If the user is not authenticated...
      if (!authenticated) {
        // Redirect to the sign-in page with a redirectUrl param
        const urlTree = router.parseUrl(`/auth/login`);
        return of(urlTree);
      }

      // Allow access to protected route
      return of(true);
    }),
    catchError((error) => {
      console.error('Authentication check failed', error);
      const urlTree = router.parseUrl(`/auth/login`);
      return of(urlTree);
    })
  );
};

