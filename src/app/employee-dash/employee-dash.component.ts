import { Component, inject, computed, OnInit } from '@angular/core';
import { GetEmployeeService } from '../shared/services/get-employee.service';
import { GetProjectsService } from '../shared/services/get-projects.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-employee-dash',
  imports: [MatDividerModule, MatButtonModule, MatCardModule, MatChipsModule],
  template: `
    <mat-divider />
    <div class="wrap">
      <div>
        {{ greet }},
        <span class="bold">
          {{ employeeData()?.firstName }}
          {{ employeeData()?.lastName }}
        </span>
        !
      </div>
      <button (click)="clearEmployeeData()" mat-stroked-button>
        {{ cancel }}
      </button>
    </div>
    <mat-divider />
    <div class="wrap">
      <h3>{{ projects }}</h3>
    </div>
    <div class="projectsWrap">
      @for (project of projectsData()?.items; track project.name) {
      <mat-card class="example-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ project.name }}</mat-card-title>
        </mat-card-header>
        <mat-card-footer class="example-card-footer">
          <mat-chip-set>
            <mat-chip>
              {{ owner }}
              <span class="bold">{{ project.owner }}</span>
            </mat-chip>
          </mat-chip-set>
          <mat-chip-set>
            <mat-chip>
              {{ budget }}
              <span class="bold">{{ project.spent }}</span> /
              <span class="bold">
                {{ project.budget }} {{ project.currency }}
              </span>
            </mat-chip>
          </mat-chip-set>
        </mat-card-footer>
      </mat-card>
      } @empty {
      <span class="bold">{{ no_projects }}</span>
      }
    </div>
    <mat-divider />
  `,
  styles: [
    '.bold {font-weight: 600;}',
    '.wrap {display: flex; flex-direction: row; justify-content: space-between; gap: 16px; width: 100vw; max-width: 768px; margin: 1rem;}',
    '.projectsWrap {display: flex; flex-direction: column; gap: 16px; width: 100vw; max-width: 768px; margin: 1rem;}',
    '.example-card-footer {display: flex; flex-direction: row; padding: 16px; gap: 8px;}',
    'mat-card-title {font-size: 20px; font-weight: 600}',
    'h3 {margin: 0}',
  ],
})
export class EmployeeDashComponent implements OnInit {
  private getEmployeeService = inject(GetEmployeeService);
  private getProjectsService = inject(GetProjectsService);

  employeeData = computed(() => this.getEmployeeService.employeeData());
  projectsData = computed(() => this.getProjectsService.projectsData());

  clearEmployeeData = () => {
    this.getEmployeeService.employeeData.set(null);
  };

  greet = 'Sveiki';
  cancel = 'Atšaukti';
  projects = 'Projektai';
  no_projects = 'Nėra aktyvių projektų.';
  owner = 'Savininkas:';
  budget = 'Biudžetas:';

  ngOnInit() {
    this.getProjectsService.fetchProjectsData().subscribe();
  }
}
