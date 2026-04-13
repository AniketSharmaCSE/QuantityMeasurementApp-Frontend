import { Component, OnInit } from '@angular/core';
import { MeasurementService } from '../../../core/services/measurement.service';
import { HistoryService } from '../../../core/services/history.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  MeasurementType, ActionType,
  CompareRequest, ConvertRequest, CalculateRequest,
  QuantityResponse
} from '../../../core/models/measurement.models';

@Component({
  selector: 'app-measurement',
  templateUrl: './measurement.component.html'
})
export class MeasurementComponent implements OnInit {

  // These two values are shared between all child panel components
  currentType: MeasurementType = 'Length';
  currentAction: ActionType = 'compare';

  // The result from the last API call — passed to ResultBoxComponent via @Input
  result: QuantityResponse | null = null;
  resultError = '';
  isLoading = false;

  constructor(
    private measurementService: MeasurementService,
    private historyService: HistoryService,
    public authService: AuthService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    // Load history depending on login state
    if (this.authService.isLoggedIn) {
      this.historyService.loadFromServer().subscribe();
    } else {
      this.historyService.loadSession();
    }
  }

  // ─── Called by TypeSelectorComponent via (typeChange) EventEmitter ───
  onTypeChange(type: MeasurementType): void {
    this.currentType = type;
    // Temperature doesn't support arithmetic
    if (type === 'Temperature' && this.currentAction === 'arith') {
      this.currentAction = 'compare';
    }
    this.clearResult();
  }

  // ─── Called by ActionTabsComponent via (actionChange) EventEmitter ───
  onActionChange(action: ActionType): void {
    this.currentAction = action;
    this.clearResult();
  }

  // ─── Called by each panel component via (execute) EventEmitter ───────
  onExecute(request: CompareRequest | ConvertRequest | CalculateRequest): void {
    this.isLoading = true;
    this.resultError = '';
    this.result = null;

    let call$;

    if (this.currentAction === 'compare') {
      call$ = this.measurementService.compare(request as CompareRequest);
    } else if (this.currentAction === 'convert') {
      call$ = this.measurementService.convert(request as ConvertRequest);
    } else {
      call$ = this.measurementService.calculate(request as CalculateRequest);
    }

    call$.subscribe({
      next: (res) => {
        this.result = res;
        this.isLoading = false;
        // Save to session (guest) or reload server history (logged in)
        if (this.authService.isLoggedIn) {
          this.historyService.loadFromServer().subscribe();
        } else {
          this.historyService.addToSession(res);
        }
      },
      error: () => {
        this.resultError = 'Could not connect to the API. Is it running?';
        this.isLoading = false;
      }
    });
  }

  clearResult(): void {
    this.result = null;
    this.resultError = '';
  }
}
