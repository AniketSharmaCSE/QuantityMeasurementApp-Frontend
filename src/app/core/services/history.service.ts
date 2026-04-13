import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { QuantityResponse } from '../models/measurement.models';

@Injectable({ providedIn: 'root' })
export class HistoryService {

  private readonly SESSION_KEY = 'qm_session_history';

  // BehaviorSubject holds the list shown in the UI.
  // HistoryListComponent subscribes to this — it automatically updates when data changes.
  private historySubject = new BehaviorSubject<QuantityResponse[]>([]);
  history$ = this.historySubject.asObservable();

  constructor(private http: HttpClient) {}

  // ─── Server history (logged-in users) ──────────────────────────

  loadFromServer(): Observable<QuantityResponse[]> {
    return this.http.get<QuantityResponse[]>(`${environment.apiBase}/history`).pipe(
      tap(items => this.historySubject.next(items))
    );
  }

  clearOnServer(): Observable<any> {
    return this.http.delete(`${environment.apiBase}/history`).pipe(
      tap(() => {
        this.historySubject.next([]);
        this.clearSession();
      })
    );
  }

  // ─── Session history (guests) ───────────────────────────────────

  addToSession(entry: QuantityResponse): void {
    const withTimestamp = { ...entry, timestamp: new Date().toISOString() };
    const existing = this.getSession();
    const updated = [withTimestamp, ...existing].slice(0, 50);
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(updated));
    this.historySubject.next(updated);
  }

  loadSession(): void {
    this.historySubject.next(this.getSession());
  }

  clearSession(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    this.historySubject.next([]);
  }

  private getSession(): QuantityResponse[] {
    return JSON.parse(sessionStorage.getItem(this.SESSION_KEY) || '[]');
  }
}
