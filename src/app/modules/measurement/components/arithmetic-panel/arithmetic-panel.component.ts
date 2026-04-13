import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MeasurementType, ArithOperation, CalculateRequest, UNITS } from '../../../../core/models/measurement.models';

@Component({
  selector: 'app-arithmetic-panel',
  templateUrl: './arithmetic-panel.component.html'
})
export class ArithmeticPanelComponent implements OnChanges {

  @Input() currentType: MeasurementType = 'Length';
  @Input() isLoading = false;
  @Output() execute = new EventEmitter<CalculateRequest>();

  units: string[] = [];
  value1 = 1;
  value2 = 1;
  unit1 = '';
  unit2 = '';
  operation: ArithOperation = 'Add';
  targetUnit = '';

  readonly operations: ArithOperation[] = ['Add', 'Subtract', 'Divide'];

  readonly opBadges: Record<ArithOperation, string> = {
    Add: '+', Subtract: '−', Divide: '÷'
  };

  // Only show "Result in" target unit selector when: Add + Length
  get showTargetUnit(): boolean {
    return this.operation === 'Add' && this.currentType === 'Length';
  }

  ngOnChanges(): void {
    this.units = UNITS[this.currentType];
    this.unit1 = this.units[0];
    this.unit2 = this.units[1] || this.units[0];
    this.targetUnit = this.units[0];
  }

  onCalculate(): void {
    const req: CalculateRequest = {
      category:  this.currentType,
      value1:    this.value1,
      unit1:     this.unit1,
      value2:    this.value2,
      unit2:     this.unit2,
      operation: this.operation
    };
    if (this.showTargetUnit) req.targetUnit = this.targetUnit;
    this.execute.emit(req);
  }
}
