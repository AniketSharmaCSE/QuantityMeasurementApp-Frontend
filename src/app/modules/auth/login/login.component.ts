import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { HistoryService } from '../../../core/services/history.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent {

  // The FormGroup holds all form controls and their validators
  loginForm: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  constructor(
    private fb: FormBuilder,          // FormBuilder creates FormGroups cleanly
    private authService: AuthService,
    private historyService: HistoryService,
    private notifService: NotificationService,
    private router: Router
  ) {
    // Build the form — each key maps to an <input formControlName="...">
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // Convenience getters — used in the template as  f['username'].errors
  get f() { return this.loginForm.controls; }

  onSubmit(): void {
    this.errorMessage = '';

    // Mark all fields as touched so validation errors appear on submit
    this.loginForm.markAllAsTouched();
    if (this.loginForm.invalid) return;

    this.isLoading = true;

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.notifService.show(`Welcome back, ${res.username}!`, 'success');
        this.historyService.loadFromServer().subscribe();
        this.router.navigate(['/measure']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || 'Invalid username or password.';
        this.isLoading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
