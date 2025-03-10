import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from '../interfaces/all';

@Component({
  selector: 'app-admin-panel',
  imports: [],
  template: ` <p>admin-panel works!</p> `,
  styles: ``,
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  isLoggedIn: boolean = false;
  loggedInStatusSub?: Subscription;

  ngOnInit() {
    this.authService.updateUserSubject();
    this.loggedInStatusSub = this.authService.user$.subscribe(
      (res: UserModel | null) => {
        if (res === null) {
          this.isLoggedIn = false;
          this.router.navigateByUrl('/login');
        } else {
          if (localStorage.getItem('pocketbase_auth') !== null) {
            this.isLoggedIn = true;
          } else {
            this.isLoggedIn = false;
            this.router.navigateByUrl('/login');
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.loggedInStatusSub?.unsubscribe();
  }
}
