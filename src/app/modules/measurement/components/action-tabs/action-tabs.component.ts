import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ActionType } from '../../../../core/models/measurement.models';

@Component({
  selector: 'app-action-tabs',
  templateUrl: './action-tabs.component.html'
})
export class ActionTabsComponent {

  @Input() currentAction: ActionType = 'compare';
  @Input() isTemperature = false;   // Temperature disables the Arithmetic tab
  @Output() actionChange = new EventEmitter<ActionType>();

  select(action: ActionType): void {
    if (action === 'arith' && this.isTemperature) return; // guard
    this.actionChange.emit(action);
  }
}
