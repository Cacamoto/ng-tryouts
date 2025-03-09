import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { GetEmployeeService } from '../shared/services/get-employee.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ClientResponseError } from 'pocketbase';

@Component({
  selector: 'app-login-screen',
  imports: [
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    CommonModule,
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
    '.err {font-size: 12px;width: 100%; padding: 0 16px;}',
  ],
})
export class LoginScreenComponent {
  employeeNoForm = new FormControl('', [Validators.required]);
  please_login = 'Prašome prisijungti!';
  scan_card = 'Prilieskite savo RFID kortelę prie skaitytuvo.';
  must_enter = 'Būtina įvesti ';
  employee_no = 'darbuotojo kodą!';
  employee_not_found = 'Darbuotojas su tokiu ID neegzistuoja.';
  unknown_error = 'Įvyko nežinoma klaida.';

  private getEmployeeService = inject(GetEmployeeService);
  private _snackBar = inject(MatSnackBar);

  employeeData = computed(() => this.getEmployeeService.employeeData());

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onSubmit() {
    if (this.employeeNoForm.valid) {
      const employeeNo = Number(this.employeeNoForm.value);
      this.getEmployeeService.fetchEmployeeData(employeeNo).subscribe({
        next: () => {
          console.log(this.employeeData());
        },
        error: (error: ClientResponseError) => {
          if (error.status === 404) {
            this.openSnackBar(this.employee_not_found, 'X');
          } else {
            this.openSnackBar(this.unknown_error, 'X');
          }
        },
      });
    } else {
      this.employeeNoForm.markAsTouched();
    }
  }
}
