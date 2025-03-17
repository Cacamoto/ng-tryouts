import { Component, inject, Inject, signal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Project } from '../interfaces/all';
import { GetProjectsService } from '../shared/services/get-projects.service';

type UpdateDisplayFunction = (display: string) => void;

@Component({
  selector: 'app-acp-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
  template: `
    <h2 class="title" mat-dialog-title>{{ data.title }}</h2>
    <!-- EDIT PROJECT -->
    @if (currentDisplay() === 'editProject') {
    <form [formGroup]="editProjectForm" (ngSubmit)="onSubmitProjectEdit()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>{{ project_name }}</mat-label>
          <input matInput formControlName="name" required />
          @if (editProjectForm.get('name')?.hasError('required') &&
          editProjectForm.get('name')?.touched) {
          <mat-error>{{ field_required }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ owner }}</mat-label>
          <input matInput formControlName="owner" required />
          @if (editProjectForm.get('owner')?.hasError('required') &&
          editProjectForm.get('owner')?.touched) {
          <mat-error>{{ field_required }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ budget }}</mat-label>
          <input matInput type="number" formControlName="budget" required />
          @if (editProjectForm.get('budget')?.hasError('required') &&
          editProjectForm.get('budget')?.touched) {
          <mat-error>{{ field_required }}</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close type="button">{{ cancel }}</button>
        <button mat-button type="submit" [disabled]="!editProjectForm.valid">
          {{ save }}
        </button>
      </mat-dialog-actions>
    </form>
    }
    <!-- DELETE PROJECT  -->
    @if (currentDisplay() === 'deleteProject') {
    <mat-dialog-content>
      <strong>{{ data.message }}</strong>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close type="button">{{ cancel }}</button>
      <button mat-button class="danger" (click)="onSubmitProjectDelete()">
        {{ delete }}
      </button>
    </mat-dialog-actions>
    }
    <!-- CREATE PROJECT -->
    @if (currentDisplay() === 'createProject') {
    <form [formGroup]="createProjectForm" (ngSubmit)="onSubmitProjectCreate()">
      <mat-dialog-content>
        <mat-form-field>
          <mat-label>{{ project_name }}</mat-label>
          <input matInput formControlName="name" required />
          @if (createProjectForm.get('name')?.hasError('required') &&
          createProjectForm.get('name')?.touched) {
          <mat-error>{{ field_required }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ owner }}</mat-label>
          <input matInput formControlName="owner" required />
          @if (createProjectForm.get('owner')?.hasError('required') &&
          createProjectForm.get('owner')?.touched) {
          <mat-error>{{ field_required }}</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>{{ budget }}</mat-label>
          <input matInput type="number" formControlName="budget" required />
          @if (createProjectForm.get('budget')?.hasError('required') &&
          createProjectForm.get('budget')?.touched) {
          <mat-error>{{ field_required }}</mat-error>
          }
        </mat-form-field>
      </mat-dialog-content>
      <mat-dialog-actions>
        <button mat-button mat-dialog-close type="button">{{ cancel }}</button>
        <button mat-button type="submit" [disabled]="!createProjectForm.valid">
          {{ save }}
        </button>
      </mat-dialog-actions>
    </form>
    }
  `,
  styles: [
    '.title {font-weight: 600; font-size: 20px}',
    'mat-form-field { display: block; margin-bottom: 16px;  width: 480px }',
    '.danger {color: red}',
  ],
})
export class AcpDialogComponent implements OnInit {
  private updateProjectsService = inject(GetProjectsService);

  currentDisplay = signal<string>('');
  editProjectForm: FormGroup;
  createProjectForm: FormGroup;

  cancel = 'Atšaukti';
  save = 'Išsaugoti';
  project_name = 'Projekto pavadinimas:';
  owner = 'Savininkas';
  budget = 'Biudžetas';
  field_required = 'Būtina užpildyti laukelį';
  delete = 'Ištrinti';

  constructor(
    public dialogRef: MatDialogRef<AcpDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      message: string;
      project: Project;
      updateView: (updateDisplay: UpdateDisplayFunction) => void;
    },
    private fb: FormBuilder
  ) {
    this.updateView();
    this.editProjectForm = this.fb.group({
      name: ['', Validators.required],
      owner: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
    });
    this.createProjectForm = this.fb.group({
      name: ['', Validators.required],
      owner: ['', Validators.required],
      budget: ['', [Validators.required, Validators.min(0)]],
    });
  }

  ngOnInit() {
    if (this.data.project) {
      this.editProjectForm.patchValue({
        name: this.data.project.name,
        owner: this.data.project.owner,
        budget: this.data.project.budget,
      });
    }
  }

  updateDisplay(display: string) {
    this.currentDisplay.set(display);
  }

  updateView() {
    this.data.updateView(this.updateDisplay.bind(this));
  }

  onSubmitProjectEdit() {
    const formData = {
      name: this.editProjectForm.get('name')?.value,
      owner: this.editProjectForm.get('owner')?.value,
      budget: this.editProjectForm.get('budget')?.value,
    };

    if (this.editProjectForm.valid) {
      this.updateProjectsService
        .updateProject(this.data.project.id, formData)
        .subscribe();
      this.dialogRef.close(this.editProjectForm.value);
    }
  }

  onSubmitProjectDelete() {
    this.updateProjectsService.deleteProject(this.data.project.id).subscribe();
    this.dialogRef.close(this.editProjectForm.value);
  }

  onSubmitProjectCreate() {
    const formData = {
      name: this.createProjectForm.get('name')?.value,
      owner: this.createProjectForm.get('owner')?.value,
      budget: this.createProjectForm.get('budget')?.value,
      currency: '€',
    };

    if (this.createProjectForm.valid) {
      this.updateProjectsService.createProject(formData).subscribe();
      this.dialogRef.close(this.editProjectForm.value);
    }
  }
}
