import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserModel } from '../interfaces/all';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';

@Component({
  selector: 'app-admin-panel',
  imports: [MatButtonModule, MatMenuModule, MatDivider],
  template: `
    <mat-divider />

    <div class="full">
      <button mat-button [matMenuTriggerFor]="menu">
        {{ userName }}
      </button>
      <mat-menu #menu="matMenu">
        <button (click)="logOut()" mat-menu-item>{{ log_out }}</button>
      </mat-menu>
    </div>
    <mat-divider />
  `,
  styles: [
    '.full {display: flex; justify-content: end; gap: 16px; width: calc(100vw - 2rem); margin: 8px 1rem;}',
  ],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);

  isLoggedIn: boolean = false;
  userName: string = '';
  loggedInStatusSub?: Subscription;

  log_out = 'Atsijungti';

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.authService.updateUserSubject();
    this.loggedInStatusSub = this.authService.user$.subscribe(
      (res: UserModel | null) => {
        if (res === null) {
          this.isLoggedIn = false;
          this.router.navigateByUrl('/login');
        } else {
          if (localStorage.getItem('pocketbase_auth') !== null) {
            this.userName = JSON.parse(
              localStorage.getItem('pocketbase_auth')!
            ).record.email;
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
