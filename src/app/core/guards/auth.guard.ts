import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// Protects routes that require login.
// Add  canActivate: [AuthGuard]  to any route in the router module.
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isLoggedIn) {
      return true;
    }
    // User is not logged in → send them to the login page
    this.router.navigate(['/auth/login']);
    return false;
  }
}
