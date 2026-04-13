import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { MeasurementComponent } from './measurement/measurement.component';
import { TypeSelectorComponent } from './components/type-selector/type-selector.component';
import { ActionTabsComponent } from './components/action-tabs/action-tabs.component';
import { ComparePanelComponent } from './components/compare-panel/compare-panel.component';
import { ConvertPanelComponent } from './components/convert-panel/convert-panel.component';
import { ArithmeticPanelComponent } from './components/arithmetic-panel/arithmetic-panel.component';
import { ResultBoxComponent } from './components/result-box/result-box.component';
import { HistoryListComponent } from './components/history-list/history-list.component';
import { SharedModule } from '../shared/shared.module';

const routes: Routes = [
  { path: '', component: MeasurementComponent }
];

@NgModule({
  declarations: [
    MeasurementComponent,
    TypeSelectorComponent,
    ActionTabsComponent,
    ComparePanelComponent,
    ConvertPanelComponent,
    ArithmeticPanelComponent,
    ResultBoxComponent,
    HistoryListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,              // For [(ngModel)] in the panel inputs
    SharedModule,
    RouterModule.forChild(routes)
  ]
})
export class MeasurementModule {}
