import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { ClientResponseError } from 'pocketbase';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { UserModel } from '../interfaces/all';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  template: `
    <mat-card class="login-card">
      <mat-card-header>
        <mat-card-title>{{ please_login }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <form (ngSubmit)="login()">
          <mat-form-field appearance="fill">
            <mat-label>{{ email }}</mat-label>
            <input
              matInput
              type="email"
              [(ngModel)]="emailAddress"
              name="email"
              required
            />
          </mat-form-field>
          <mat-form-field appearance="fill">
            <mat-label>{{ pass }}</mat-label>
            <input
              matInput
              type="password"
              [(ngModel)]="password"
              name="password"
              required
            />
          </mat-form-field>
          <button mat-raised-button color="primary" type="submit">
            {{ log_in }}
          </button>
        </form>
      </mat-card-content>
    </mat-card>

    <mat-card class="login-card">
      <div class="info">
        <span class="bold">{{ login_info }}</span>
        <div>
          <span>{{ email }}:</span>
          <span class="bold"> admin&#64;123.com</span>
        </div>
        <div>
          <span>{{ pass }}:</span>
          <span class="bold"> 1234567890</span>
        </div>
      </div>
    </mat-card>
  `,
  styles: [
    '.login-card {width: 460px; margin: 2rem auto;text-align: center;}',
    'mat-form-field {display: block;margin-bottom: 1em;}',
    'button {width: 100%;}',
    'mat-card-title {margin-bottom: 1rem; font-size: 20px; font-weight: 600}',
    '.info {margin: 1rem; display: flex; flex-direction: column; gap: 8px; align-items: start;}',
    '.bold {font-weight: 600;}',
  ],
})
export class LoginComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  private _snackBar = inject(MatSnackBar);

  isLoggedIn: boolean = false;
  loggedInStatusSub?: Subscription;

  emailAddress: string = '';
  password: string = '';

  please_login = 'Prašome prisijungti';
  email = 'El. Paštas';
  pass = 'Slaptažodis';
  log_in = 'Prisijungti';
  login_failed = 'Nepavyko prisijungti!';
  login_info = 'Prisijungimo informacija:';

  login() {
    this.authService
      .login(this.emailAddress, this.password)
      .then((res: boolean) => {
        if (res) {
          this.router.navigateByUrl('/acp');
        }
      })
      .catch((err: ClientResponseError) => {
        console.log(err);
        this.openSnackBar(this.login_failed, 'X');
      });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  ngOnInit() {
    this.authService.updateUserSubject();
    this.loggedInStatusSub = this.authService.user$.subscribe(
      (res: UserModel | null) => {
        if (res === null) {
          this.isLoggedIn = false;
        } else {
          if (localStorage.getItem('pocketbase_auth') !== null) {
            this.isLoggedIn = true;
            this.router.navigateByUrl('/acp');
          } else {
            this.isLoggedIn = false;
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.loggedInStatusSub?.unsubscribe();
  }
}
