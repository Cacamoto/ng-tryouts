import {
  Component,
  inject,
  computed,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
} from '@angular/core';
import { GetEmployeeService } from '../shared/services/get-employee.service';
import { GetProjectsService } from '../shared/services/get-projects.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { Project } from '../interfaces/all';
import {
  FormControl,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-employee-dash',
  imports: [
    MatDividerModule,
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
  ],
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
      @if (selectedProject() === null) {
      <h3>
        {{ projects }}
      </h3>
      }
    </div>
    <div class="projectsWrap">
      <!-- PROJECTS LIST  -->
      @if (selectedProject() === null) { @for (project of projectsData()?.items;
      track project.name) {
      <mat-card class="example-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ project.name }}</mat-card-title>
          <button (click)="selectProject(project)" mat-stroked-button>
            {{ select }}
          </button>
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
      } } @else {
      <!-- SELECTED PROJECT  -->
      <mat-card class="example-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ selectedProject()?.name }}</mat-card-title>
          <button (click)="clearProject()" mat-stroked-button>
            {{ cancel }}
          </button>
        </mat-card-header>
        <mat-card-content>
          <mat-form-field>
            <input
              #itemNoInput
              type="number"
              matInput
              [formControl]="itemNoForm"
            />
            @if (itemNoForm.hasError('required')) {
            <mat-error>
              {{ must_enter }}<strong>{{ item_id }} </strong>
            </mat-error>
            }
          </mat-form-field>
        </mat-card-content>
        <mat-card-footer class="example-card-footer">
          <mat-chip-set>
            <mat-chip>
              {{ owner }}
              <span class="bold">{{ selectedProject()?.owner }}</span>
            </mat-chip>
          </mat-chip-set>
          <mat-chip-set>
            <mat-chip>
              {{ budget }}
              <span class="bold">{{ selectedProject()?.spent }}</span> /
              <span class="bold">
                {{ selectedProject()?.budget }}
                {{ selectedProject()?.currency }}
              </span>
            </mat-chip>
          </mat-chip-set>
        </mat-card-footer>
      </mat-card>
      }
    </div>
    <mat-divider />
    @if(projectsData()?.totalItems ?? 0 > itemCount && selectedProject() ===
    null) {
    <mat-paginator
      [length]="projectsData()!.totalItems"
      [pageSize]="projectsData()!.perPage"
      [pageIndex]="projectsData()!.page - 1"
      (page)="pageChanged($event)"
      showFirstLastButtons="true"
    >
    </mat-paginator>
    <mat-divider />
    }
  `,
  styles: [
    '.bold {font-weight: 600;}',
    '.wrap {display: flex; flex-direction: row; justify-content: space-between; gap: 16px; width: 100vw; max-width: 768px; margin: 1rem;}',
    '.projectsWrap {display: flex; flex-direction: column; gap: 16px; width: 100vw; max-width: 768px; margin: 1rem;}',
    '.example-card-footer {display: flex; flex-direction: row; padding: 16px; gap: 8px;}',
    'mat-card-title {font-size: 20px; font-weight: 600}',
    'mat-card-header {display: flex; flex-direction: row; justify-content: space-between; gap: 16px; width: calc(100% - 2rem) }',
    'h3 {margin: 0}',
  ],
})
export class EmployeeDashComponent implements OnInit {
  private getEmployeeService = inject(GetEmployeeService);
  private getProjectsService = inject(GetProjectsService);
  public selectedProject = signal<Project | null>(null);

  itemNoForm = new FormControl('', [Validators.required]);

  employeeData = computed(() => this.getEmployeeService.employeeData());
  projectsData = computed(() => this.getProjectsService.projectsData());

  @ViewChild('itemNoInput') itemNoInput!: ElementRef<HTMLInputElement>;

  clearEmployeeData = () => {
    this.getEmployeeService.employeeData.set(null);
  };

  greet = 'Sveiki';
  cancel = 'Atšaukti';
  projects = 'Projektai';
  no_projects = 'Nėra aktyvių projektų.';
  owner = 'Savininkas:';
  budget = 'Biudžetas:';
  select = 'Pasirinkti';
  must_enter = 'Būtina įvesti ';
  item_id = 'daikto ID!';

  itemCount = 3;

  ngOnInit() {
    this.getProjectsService.fetchProjectsData(this.itemCount, 1).subscribe();
  }

  pageChanged(event: PageEvent) {
    const newPage = event.pageIndex + 1;
    this.getProjectsService
      .fetchProjectsData(this.itemCount, newPage)
      .subscribe();
  }

  selectProject(project: Project) {
    this.selectedProject.set(project);
    setTimeout(() => {
      this.itemNoInput.nativeElement.focus();
    }, 50);
  }

  clearProject() {
    this.selectedProject.set(null);
  }
}
