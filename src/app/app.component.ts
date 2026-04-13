import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from './core/services/auth.service';
import { NotificationService } from './core/services/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private notifService: NotificationService
  ) {}

  ngOnInit(): void {
    // Handle Google OAuth redirect — the C# API sends token in the URL query params
    // e.g. /?token=xxx&username=yyy&email=zzz&name=www
    const params = new URLSearchParams(window.location.search);
    if (params.has('token')) {
      this.authService.handleOAuthRedirect({
        token:    params.get('token')!,
        username: params.get('username')!,
        email:    params.get('email')!,
        name:     params.get('name')!
      });
      // Clean the token out of the URL bar (no reload needed)
      window.history.replaceState({}, document.title, window.location.pathname);
      this.notifService.show('Logged in with Google!', 'success');
      this.router.navigate(['/measure']);
    }
  }
}
