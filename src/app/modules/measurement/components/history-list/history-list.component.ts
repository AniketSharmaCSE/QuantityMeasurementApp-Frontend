import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HistoryService } from '../../../../core/services/history.service';
import { AuthService } from '../../../../core/services/auth.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { QuantityResponse } from '../../../../core/models/measurement.models';

@Component({
  selector: 'app-history-list',
  templateUrl: './history-list.component.html'
})
export class HistoryListComponent implements OnInit {

  // Async pipe in the template subscribes/unsubscribes automatically
  history$: Observable<QuantityResponse[]>;
  isLoggedIn = false;

  constructor(
    private historyService: HistoryService,
    private authService: AuthService,
    private notifService: NotificationService
  ) {
    this.history$ = this.historyService.history$;
  }

  ngOnInit(): void {
    this.isLoggedIn = this.authService.isLoggedIn;
  }

  refresh(): void {
    if (this.isLoggedIn) {
      this.historyService.loadFromServer().subscribe();
    } else {
      this.historyService.loadSession();
    }
  }

  clearAll(): void {
    if (this.isLoggedIn) {
      this.historyService.clearOnServer().subscribe({
        next: () => this.notifService.show('History cleared.', 'success'),
        error: () => this.notifService.show('Could not clear history.', 'error')
      });
    } else {
      this.historyService.clearSession();
    }
  }

  // Helper methods used in the template
  getDetail(item: QuantityResponse): string {
    const o1 = item.operand1, o2 = item.operand2;
    if (item.operation === 'Compare') return `${o1?.value} ${o1?.unit} vs ${o2?.value} ${o2?.unit}`;
    if (item.operation === 'Convert') return `${o1?.value} ${o1?.unit}`;
    return `${o1?.value} ${o1?.unit} · ${o2?.value} ${o2?.unit}`;
  }

  getResult(item: QuantityResponse): string {
    if (item.operation === 'Compare') return item.boolResult === true ? 'Equal' : 'Not Equal';
    if (item.operation === 'Convert') {
      const v = item.result?.value;
      return v != null ? `${(+v.toFixed(4))} ${item.result?.unit}` : '—';
    }
    const rv = item.scalarResult != null ? item.scalarResult : item.result?.value;
    return rv != null ? `${(+(rv as number).toFixed(4))} ${item.result?.unit ?? ''}` : '—';
  }

  getCategory(item: QuantityResponse): string {
    return item.operand1?.category || item.result?.category || '';
  }

  formatTime(timestamp?: string): string {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString();
  }
}
