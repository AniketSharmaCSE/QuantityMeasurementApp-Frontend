import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthService } from "app/core/services/auth.service";
import { HistoryService } from "app/core/services/history.service";

export interface CurrentUser {
  username: string;
  email: string;
  name: string;
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html"
})
export class HeaderComponent implements OnInit {

  currentUser$!: Observable<CurrentUser | null>;

  constructor(
    private authService: AuthService,
    private historyService: HistoryService
  ) {}

  ngOnInit(): void {
    this.currentUser$ = this.authService.currentUser$;
  }

  logout(): void {
    this.historyService.clearSession();
    this.authService.logout();
  }
}
