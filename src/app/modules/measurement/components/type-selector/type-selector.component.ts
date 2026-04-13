import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MeasurementType } from '../../../../core/models/measurement.models';

@Component({
  selector: 'app-type-selector',
  templateUrl: './type-selector.component.html'
})
export class TypeSelectorComponent {

  // @Input receives data FROM the parent component
  @Input() currentType: MeasurementType = 'Length';

  // @Output sends data TO the parent component when the user clicks a type card
  @Output() typeChange = new EventEmitter<MeasurementType>();

  types: { label: MeasurementType; icon: string }[] = [
    { label: 'Length',      icon: '✏️' },
    { label: 'Weight',      icon: '⚖️' },
    { label: 'Temperature', icon: '🌡️' },
    { label: 'Volume',      icon: '🧪' }
  ];

  select(type: MeasurementType): void {
    // Emit the new type up to the parent (MeasurementComponent)
    this.typeChange.emit(type);
  }
}
