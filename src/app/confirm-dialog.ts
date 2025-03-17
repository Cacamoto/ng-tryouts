// confirm-dialog.component.ts
import { Component, inject, Inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormControl,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SaveItemService } from './shared/services/save-item.service';
import { Employee, Item, Project, WarehouseProduct } from './interfaces/all';

type UpdateDisplayFunction = (display: string) => void;

@Component({
  selector: 'app-confirm-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    @if (currentDisplay() === 'main') {
    <h2 class="title" mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <strong> {{ data.message }}</strong>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">{{ cancel }}</button>
      <button mat-button (click)="onConfirm(data.UID)">{{ confirm }}</button>
    </mat-dialog-actions>
    } @if (currentDisplay() === 'confirm') {
    <h2 class="title" mat-dialog-title>{{ auth_please }}</h2>
    <mat-dialog-content>
      {{ scan_the_card }}
    </mat-dialog-content>
    <mat-dialog-actions>
      <form (ngSubmit)="enterUID()">
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
    </mat-dialog-actions>
    } @if (currentDisplay() === 'cancelled') {
    <h2 class="title" mat-dialog-title>{{ addition_cancelled }}</h2>
    <mat-dialog-content>
      <span>Grįšite į terminalą po {{ countdown() }} sekundžių.</span>
    </mat-dialog-content>
    } @if (currentDisplay() === 'failed') {
    <h2 class="title" mat-dialog-title>{{ auth_failed }}</h2>
    <mat-dialog-content>
      <span>Grįšite į terminalą po {{ countdown() }} sekundžių.</span>
    </mat-dialog-content>
    } @if (currentDisplay() === 'success') {
    <h2 class="title" mat-dialog-title>{{ success }}</h2>
    <mat-dialog-content>
      <span>Grįšite į terminalą po {{ countdown() }} sekundžių.</span>
    </mat-dialog-content>
    }
  `,
  styles: ['.title {font-weight: 600; font-size: 20px}'],
})
export class ConfirmDialogComponent {
  private saveItemService = inject(SaveItemService);

  employeeNoForm = new FormControl('', [Validators.required]);

  currentDisplay = signal<string>('main');
  timeOutMs = 5000;
  countdown = signal<number>(this.timeOutMs / 1000);

  constructor(
    public dialogRef: MatDialogRef<ConfirmDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      UID: number;
      onConfirm: (updateDisplay: UpdateDisplayFunction) => void;
      onCancel: (updateDisplay: UpdateDisplayFunction) => void;
      item: WarehouseProduct;
      project: Project;
      employee: Employee;
      quantity: number;
      lot: number;
    }
  ) {}

  confirm = 'Patvirtinti';
  cancel = 'Atmesti išdavimą';
  addition_cancelled = 'Išdavimas atmestas';
  auth_please = 'Prašome autorizuotis';
  scan_the_card = 'Nuskenuokite save RFID kortelę dar kartą.';
  auth_failed = 'Autorizacija nepavyko!';
  success = 'Operacija atlikta!';

  must_enter = 'Būtina įvesti ';
  employee_no = 'darbuotojo kodą!';

  onConfirm(UID: number) {
    console.log(UID);
    this.data.onConfirm(this.updateDisplay.bind(this));
  }

  onCancel() {
    this.data.onCancel(this.updateDisplay.bind(this));
    this.setTimer();
  }

  setTimer() {
    const interval = setInterval(() => {
      this.countdown.update((value) => value - 1);
    }, 1000);

    setTimeout(() => {
      clearInterval(interval);
      this.closeDialog();
      this.updateDisplay('main');
    }, this.timeOutMs);
  }

  updateDisplay(display: string) {
    this.currentDisplay.set(display);
  }

  closeDialog() {
    this.dialogRef.close();
    this.countdown.set(this.timeOutMs / 1000);
  }

  enterUID() {
    if (this.employeeNoForm.valid) {
      if (Number(this.employeeNoForm.value) === Number(this.data.UID)) {
        this.saveItemService.transferItem(
          this.data.item,
          this.data.project,
          this.data.employee,
          this.data.quantity,
          this.data.lot
        );
        this.updateDisplay('success');
        this.setTimer();
      } else {
        this.updateDisplay('failed');
        this.setTimer();
      }
    }
  }
}
