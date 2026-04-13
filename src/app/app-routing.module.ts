import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

// Lazy loading: each module is only downloaded when the user navigates to that route.
// This keeps the initial bundle small — Angular best practice.
const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then(m => m.AuthModule)
  },
  {
    path: 'measure',
    // No AuthGuard here — guests can use the calculator with session history,
    // matching the original app. Add canActivate: [AuthGuard] if you want login required.
    loadChildren: () =>
      import('./modules/measurement/measurement.module').then(m => m.MeasurementModule)
  },
  { path: '',        redirectTo: 'measure', pathMatch: 'full' },
  { path: '**',      redirectTo: 'measure' }   // Catch-all fallback
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
