import { Component, OnInit } from '@angular/core';
import { NotificationService, Notification } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-notification',
  template: `
    <div class="notif"
         *ngIf="notif"
         [class.show]="!!notif"
         [class.success]="notif.type === 'success'"
         [class.error]="notif.type === 'error'">
      {{ notif.message }}
    </div>
  `
})
export class NotificationComponent implements OnInit {

  notif: Notification | null = null;

  constructor(private notifService: NotificationService) {}

  ngOnInit(): void {
    // Subscribes to the BehaviorSubject in NotificationService
    this.notifService.notification$.subscribe(n => this.notif = n);
  }
}
