import { Component, Input } from '@angular/core';
import { QuantityResponse } from '../../../../core/models/measurement.models';

@Component({
  selector: 'app-result-box',
  templateUrl: './result-box.component.html'
})
export class ResultBoxComponent {

  @Input() result: QuantityResponse | null = null;
  @Input() errorMessage = '';

  get isVisible(): boolean {
    return !!this.result || !!this.errorMessage;
  }

  get isError(): boolean {
    return !!this.errorMessage;
  }

  get displayValue(): string {
    if (this.errorMessage) return this.errorMessage;
    if (!this.result) return '—';

    if (this.result.operation === 'Compare') {
      return this.result.boolResult === true ? 'Equal' : 'Not Equal';
    }
    if (this.result.operation === 'Convert') {
      const v = this.result.result?.value;
      return v != null ? `${(+v.toFixed(6))} ${this.result.result?.unit}` : '—';
    }
    // Arithmetic
    const rv = this.result.scalarResult != null
      ? this.result.scalarResult
      : this.result.result?.value;
    return rv != null ? `${(+rv.toFixed(6))} ${this.result.result?.unit ?? ''}` : '—';
  }

  get displayMeta(): string {
    if (!this.result) return '';
    const o1 = this.result.operand1;
    const o2 = this.result.operand2;
    if (this.result.operation === 'Compare') {
      return `${o1?.value} ${o1?.unit} vs ${o2?.value} ${o2?.unit}`;
    }
    if (this.result.operation === 'Convert') {
      return `${o1?.value} ${o1?.unit} → ${this.result.result?.unit}`;
    }
    return `${o1?.value} ${o1?.unit} ${this.result.operation?.toLowerCase()} ${o2?.value} ${o2?.unit}`;
  }

  get valueColor(): string {
    if (this.errorMessage) return 'var(--accent)';
    if (this.result?.operation === 'Compare') {
      return this.result.boolResult === true ? 'var(--success)' : 'var(--accent)';
    }
    return 'var(--primary)';
  }
}
