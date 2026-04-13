import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { MeasurementType, ConvertRequest, QuantityResponse, UNITS } from '../../../../core/models/measurement.models';

@Component({
  selector: 'app-convert-panel',
  templateUrl: './convert-panel.component.html'
})
export class ConvertPanelComponent implements OnChanges {

  @Input() currentType: MeasurementType = 'Length';
  @Input() isLoading = false;
  @Input() lastResult: QuantityResponse | null = null;
  @Output() execute = new EventEmitter<ConvertRequest>();

  units: string[] = [];
  value = 1;
  fromUnit = '';
  toUnit = '';

  ngOnChanges(): void {
    this.units = UNITS[this.currentType];
    this.fromUnit = this.units[0];
    this.toUnit   = this.units[1] || this.units[0];
  }

  // Shows the converted value inline (updated each time parent sets lastResult)
  get convertedDisplay(): string {
    if (!this.lastResult?.result) return '—';
    return (+this.lastResult.result.value.toFixed(6)).toString();
  }

  onCalculate(): void {
    this.execute.emit({
      category: this.currentType,
      value:    this.value,
      fromUnit: this.fromUnit,
      toUnit:   this.toUnit
    });
  }
}
