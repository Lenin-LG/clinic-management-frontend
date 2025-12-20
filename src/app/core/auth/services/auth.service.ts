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
   */signIn(credentials: { username: string; password: string }): Observable<any> {
  if (this._authenticated) {
    return throwError(() => new Error('El usuario ya ha iniciado sesión.'));
  }

  return this._httpClient.post(`${this.baseUrl}/public/api/auth/login`, credentials).pipe(
    switchMap((response: any) => {
      // 1. Guardar los tokens principales
      this.accessToken = response.accessToken;
      this.refreshToken = response.refreshToken;

      // 2. Guardar Username y Nombre (vienen directo en tu JSON de respuesta)
      localStorage.setItem('username', response.username || '');
      localStorage.setItem('nombre', response.nombre || 'Usuario');

      // 3. Guardar el Rol 
      // Primero intentamos sacarlo de la respuesta, si no, lo sacamos del Token
      let rol = '';
      if (response.roles && response.roles.length > 0) {
        rol = Array.isArray(response.roles) ? response.roles[0] : response.roles;
      } else {
        // Usamos tu utilidad de AuthUtils si la respuesta no traía el campo roles limpio
        rol = AuthUtils.getRoleFromToken(response.accessToken) || 'USER';
      }
      
      localStorage.setItem('role', rol);

      // 4. Finalizar autenticación
      this._authenticated = true;
      this.startTokenRefreshTimer();
      
      return of(response); // Retornamos toda la respuesta para que el componente de login la use si quiere
    })
  );
}
/**
 * Sign up
 *
 * @param userPayload
 */
signUp(userPayload: any): Observable<any> {
  return this._httpClient.post(`${this.baseUrl}/public/api/auth/register`, userPayload).pipe(
    catchError((error) => {
      // Manejo de errores básico
      return throwError(() => error);
    })
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
    localStorage.removeItem('username');
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
  // Si ya está autenticado en memoria
  if (this._authenticated) {
    this._ensureUsername(); // <-- Asegurar que el username esté en storage
    return of(true);
  }

  // Si no hay token, no está autenticado
  if (!this.accessToken) {
    return of(false);
  }

  // Si el token expiró, refrescarlo
  if (AuthUtils.isTokenExpired(this.accessToken, 10)) {
    return this.refreshAccessToken().pipe(
      switchMap(() => {
        this._ensureUsername();
        return of(true);
      }),
      catchError(() => of(false))
    );
  }

  // Si el token es válido pero acabamos de cargar la página (F5)
  this._authenticated = true;
  this._ensureUsername(); 
  this.startTokenRefreshTimer();
  return of(true);
}

/**
 * Método privado para garantizar que el username esté guardado
 */
private _ensureUsername(): void {
  if (!localStorage.getItem('username') && this.accessToken) {
    const user = AuthUtils.getUsernameFromToken(this.accessToken);
    if (user) localStorage.setItem('username', user);
  }
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
