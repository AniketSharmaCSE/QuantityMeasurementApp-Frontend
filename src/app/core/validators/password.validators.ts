import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

// A custom Angular validator that checks all password rules at once.
// Returns an object with each failing rule as a key, or null if valid.
// Used by SignupComponent's ReactiveForm.
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value: string = control.value || '';
    const errors: ValidationErrors = {};

    if (value.length < 6)                        errors['minLength']  = true;
    if (!/[A-Z]/.test(value))                    errors['uppercase']  = true;
    if (!/\d/.test(value))                       errors['number']     = true;
    if (!/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?]/.test(value))
                                                 errors['special']    = true;

    return Object.keys(errors).length ? errors : null;
  };
}

// Returns a human-readable strength level for the strength bar
export function getPasswordStrength(password: string): 'weak' | 'fair' | 'strong' | '' {
  if (!password) return '';
  const checks = [
    /[A-Z]/.test(password),
    /\d/.test(password),
    /[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>\/?]/.test(password),
    password.length >= 6
  ];
  const score = checks.filter(Boolean).length;
  if (score <= 2) return 'weak';
  if (score === 3) return 'fair';
  return 'strong';
}
