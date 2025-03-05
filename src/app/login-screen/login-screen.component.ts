import { Component, ChangeDetectionStrategy } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-login-screen',
  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <mat-card appearance="outlined">
      <div class="full">
        <mat-card-title>{{ please_login }}</mat-card-title>
        <mat-card-subtitle>{{ scan_card }}</mat-card-subtitle>
      </div>
      <div class="full">
        <mat-card-content>
          <form (ngSubmit)="onSubmit()">
            <mat-form-field>
              <input
                type="number"
                autofocus
                matInput
                [formControl]="employeeNoForm"
              />
              @if (employeeNoForm.hasError('required')) {
              <mat-error>
                {{ must_enter }}<strong>{{ employee_no }} </strong>
              </mat-error>
              }
            </mat-form-field>
          </form>
        </mat-card-content>
      </div>
    </mat-card>
  `,
  styles: [
    'mat-card {display: flex; flex-direction: row; gap: 16px; width: 100vw; max-width: 768px;}',
    'mat-card-content {display: flex; justify-content: center; align-items: center}',
    'mat-card-title {padding: 1rem; padding-bottom: 0; font-weight: bold;}',
    'mat-card-subtitle {padding: 1rem; padding-top: 0;}',
    '.full {flex: 1}',
  ],
})
export class LoginScreenComponent {
  employeeNoForm = new FormControl('', [Validators.required]);
  please_login = 'Prašome prisijungti!';
  scan_card = 'Prilieskite savo RFID kortelę prie skaitytuvo.';
  must_enter = 'Būtina įvesti ';
  employee_no = 'darbuotojo kodą!';

  onSubmit() {
    if (this.employeeNoForm.valid) {
      console.log('Form is valid:', this.employeeNoForm.value);
    } else {
      console.log('Form is invalid');
      this.employeeNoForm.markAsTouched();
    }
  }
}
