import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MeasurementType, CompareRequest, UNITS } from '../../../../core/models/measurement.models';

@Component({
  selector: 'app-compare-panel',
  templateUrl: './compare-panel.component.html'
})
export class ComparePanelComponent implements OnChanges {

  @Input() currentType: MeasurementType = 'Length';
  @Input() isLoading = false;
  @Output() execute = new EventEmitter<CompareRequest>();

  units: string[] = [];
  value1 = 1;
  value2 = 1000;
  unit1 = '';
  unit2 = '';

  // ngOnChanges fires whenever an @Input changes (e.g. user picks a new type)
  ngOnChanges(): void {
    this.units = UNITS[this.currentType];
    this.unit1 = this.units[0];
    this.unit2 = this.units[1] || this.units[0];
  }

  onCalculate(): void {
    this.execute.emit({
      category: this.currentType,
      value1: this.value1,
      unit1:  this.unit1,
      value2: this.value2,
      unit2:  this.unit2
    });
  }
}
