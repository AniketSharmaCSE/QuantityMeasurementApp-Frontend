import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  message: string;
  type: 'success' | 'error' | '';
}

@Injectable({ providedIn: 'root' })
export class NotificationService {

  // Components subscribe to this to show/hide the toast
  private notifSubject = new BehaviorSubject<Notification | null>(null);
  notification$ = this.notifSubject.asObservable();

  show(message: string, type: 'success' | 'error' | '' = ''): void {
    this.notifSubject.next({ message, type });
    setTimeout(() => this.notifSubject.next(null), 2800);
  }
}
