import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthResponse, CurrentUser, LoginRequest, SignupRequest } from '../models/auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly TOKEN_KEY = 'qm_token';
  private readonly USER_KEY  = 'qm_user';

  // BehaviorSubject holds the current user — null means "logged out".
  // Components subscribe to currentUser$ to reactively update the UI.
  private currentUserSubject = new BehaviorSubject<CurrentUser | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private token: string | null = null;

  constructor(private http: HttpClient, private router: Router) {
    // Restore both token AND user on page refresh
    this.token = localStorage.getItem(this.TOKEN_KEY);
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (this.token && savedUser) {
      try {
        this.currentUserSubject.next(JSON.parse(savedUser));
      } catch {
        this.token = null;
        localStorage.removeItem(this.TOKEN_KEY);
        localStorage.removeItem(this.USER_KEY);
      }
    }
  }

  // ─── Getters ───────────────────────────────────────────────────

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  get currentUser(): CurrentUser | null {
    return this.currentUserSubject.value;
  }

  // ─── API calls ─────────────────────────────────────────────────

  login(payload: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${environment.apiBase}/auth/login`, payload).pipe(
      tap(response => this.handleAuthSuccess(response))
    );
  }

  signup(payload: SignupRequest): Observable<any> {
    return this.http.post(`${environment.apiBase}/auth/register`, payload);
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  handleOAuthRedirect(params: { token: string; username: string; email: string; name: string }): void {
    this.handleAuthSuccess(params as AuthResponse);
  }

  // ─── Private helpers ───────────────────────────────────────────

  private handleAuthSuccess(response: AuthResponse): void {
    this.token = response.token;
    const user: CurrentUser = {
      username: response.username,
      email:    response.email,
      name:     response.name
    };
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.USER_KEY,  JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
