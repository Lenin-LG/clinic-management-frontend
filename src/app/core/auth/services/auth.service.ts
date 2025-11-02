import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, throwError, switchMap, of, catchError} from 'rxjs';
import {environment} from '../../../../evironments/environment';
import {AuthUtils} from '../auth.utils';


@Injectable({providedIn: 'root'})
export class AuthService {
  private _authenticated: boolean = false;
  private _httpClient = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private refreshTimer: any;

  // -----------------------------------------------------------------------------------------------------
  // @ Accessors
  // -----------------------------------------------------------------------------------------------------

  /**
   * Setter & getter for access token
   */
  set accessToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  get accessToken(): string {
    return localStorage.getItem('accessToken') ?? '';
  }

  /**
   * Setter & getter for refresh token
   */
  set refreshToken(token: string) {
    localStorage.setItem('refreshToken', token);
  }

  get refreshToken(): string {
    return localStorage.getItem('refreshToken') ?? '';
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { username: string; password: string }): Observable<any> {
    // Throw error if the user is already logged in
    if (this._authenticated) {
    return throwError(() => new Error('El usuario ya ha iniciado sesión.'));
    }
    return this._httpClient.post(`${this.baseUrl}/public/api/auth/login`, credentials).pipe(
      switchMap((response: any) => {
      // Store the access token and refresh token in local storage
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;
        // Set the authenticated flag to true
        this._authenticated = true;
     // Start the token refresh timer
        this.startTokenRefreshTimer();
      // Return a new observable with the response
        return of(response.data);
      }),
    );
  }

  /**
   * Refresh the access token using the refresh token
   */
  refreshAccessToken(): Observable<any> {
    // If no refresh token is available, we cannot refresh the access token
    if (!this.refreshToken) {
      return throwError(() => new Error('Refresh token no disponible'));
    }

    return this._httpClient
      .post(`${this.baseUrl}/public/api/auth/refresh`, {refreshToken: this.refreshToken})
      .pipe(
        switchMap((response: any) => {
          // Update the access token and return the response
          this.accessToken = response.accessToken;
          this.refreshToken = response.refreshToken;
          this.startTokenRefreshTimer();
          return of(response);
        })
      );
  }

  /**
   * Sign out
   */
  signOut(): Observable<any> {
    // Remove the access token and refresh token from local storage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // Set the authenticated flag to false
    this._authenticated = false;
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    return of(true);
  }

  /**
   * Check the authentication status
   */
  check(): Observable<boolean> {
    // Check if the user is logged in
    if (this._authenticated) {
      return of(true);
    }

    // Check if the access token is expired
    if (AuthUtils.isTokenExpired(this.accessToken, 10)) {
      return this.refreshAccessToken().pipe(
        switchMap(() => of(true)),
        catchError(() => of(false))
      );
    }

    // Check if the access token exists and is valid
    if (!this.accessToken) {
      return of(false);
    }

    return of(true);
  }

  /**
   * Start the timer that will refresh the token 10 seconds before expiration
   */
  private startTokenRefreshTimer(): void {
    if (this.refreshTimer) {
      clearTimeout(this.refreshTimer);
    }

    const timeUntilExpiry = AuthUtils.getTimeUntilTokenExpires(this.accessToken, 10);
    if (timeUntilExpiry > 0) {
      this.refreshTimer = setTimeout(() => {
        this.refreshAccessToken().subscribe({
          error: (error) => {
            console.error('Error renovando token:', error);
          }
        });
      }, timeUntilExpiry);
    }
  }

}
