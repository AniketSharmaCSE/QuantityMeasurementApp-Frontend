import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { passwordStrengthValidator, getPasswordStrength } from '../../../core/validators/password.validators';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {

  signupForm!: FormGroup;
  errorMessage = '';
  isLoading = false;
  showPassword = false;

  // Tracks the strength label for the password bar
  passwordStrength: 'weak' | 'fair' | 'strong' | '' = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notifService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      name:     ['', [Validators.required]],
      email:    ['', [Validators.required, Validators.email]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      // passwordStrengthValidator is our custom validator from password.validators.ts
      password: ['', [Validators.required, passwordStrengthValidator()]]
    });

    // Subscribe to password value changes to update the strength bar in real time
    this.signupForm.get('password')?.valueChanges.subscribe(value => {
      this.passwordStrength = getPasswordStrength(value);
    });
  }

  get f() { return this.signupForm.controls; }

  onSubmit(): void {
    this.errorMessage = '';
    this.signupForm.markAllAsTouched();
    if (this.signupForm.invalid) return;

    this.isLoading = true;

    this.authService.signup(this.signupForm.value).subscribe({
      next: () => {
        this.notifService.show('Account created! Please log in.', 'success');
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        this.errorMessage = err.error?.message || err.error?.title || 'Registration failed.';
        this.isLoading = false;
      }
    });
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  // Returns a human-friendly error for the password field
  getPasswordError(): string {
    const ctrl = this.f['password'];
    if (!ctrl.errors) return '';
    if (ctrl.errors['minLength'])  return 'Password must be at least 6 characters.';
    if (ctrl.errors['uppercase'])  return 'Must contain at least one uppercase letter.';
    if (ctrl.errors['number'])     return 'Must contain at least one number.';
    if (ctrl.errors['special'])    return 'Must contain at least one special character.';
    return 'Invalid password.';
  }
}
