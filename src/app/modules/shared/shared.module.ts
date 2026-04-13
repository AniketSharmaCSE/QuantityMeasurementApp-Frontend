import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NotificationComponent } from './components/notification/notification.component';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, RouterModule],
  // Export so any module that imports SharedModule can use these components
  exports: [NotificationComponent, CommonModule, RouterModule]
})
export class SharedModule {}
