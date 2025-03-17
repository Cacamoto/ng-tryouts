import {
  Component,
  computed,
  inject,
  OnDestroy,
  OnInit,
  signal,
} from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Items, Project, UserModel } from '../interfaces/all';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { GetProjectsService } from '../shared/services/get-projects.service';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { AcpDialogComponent } from '../acp-dialog/acp-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GetItemsService } from '../shared/services/get-items.service';
import { MatTableModule } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface SelectItem {
  id?: number;
  lot?: number;
  value?: string;
  viewValue?: string;
}

type UpdateDisplayFunction = (display: string) => void;

@Component({
  selector: 'app-admin-panel',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatDivider,
    MatCardModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    DatePipe,
  ],
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
    <div class="wrap">
      <!-- ITEM JOURNAL -->
      <div class="row">
        <h3>
          {{ journal }}
        </h3>
        <div class="gap">
          <button mat-raised-button color="primary" (click)="exportToPDF()">
            {{ export_pdf }}
          </button>
        </div>
      </div>
      <mat-divider />
      <mat-card class="example-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ filters }}</mat-card-title>
          @if (default_employee != 0 || default_lot != 0 || default_timeFilter
          != "all") {
          <div class="gap">
            <button (click)="clearFilters()" mat-stroked-button>
              {{ clear_all }}
            </button>
          </div>
          }
        </mat-card-header>
        <mat-card-content class="row">
          <mat-form-field>
            <mat-label>{{ lot }}</mat-label>
            <mat-select
              [(value)]="default_lot"
              (selectionChange)="filterItems()"
            >
              @for (lotOption of lots(); track lotOption.id) {
              <mat-option [value]="lotOption.id">{{
                lotOption.viewValue
              }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>{{ employee_filter }}</mat-label>
            <mat-select
              [(value)]="default_employee"
              (selectionChange)="filterItems()"
            >
              @for (employeeOption of employees(); track employeeOption.id) {
              <mat-option [value]="employeeOption.id">{{
                employeeOption.viewValue
              }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
          <mat-form-field>
            <mat-label>{{ time_filter }}</mat-label>
            <mat-select
              [(value)]="default_timeFilter"
              (selectionChange)="filterItems()"
            >
              @for (timeOption of timeFilterOptions; track timeOption.value) {
              <mat-option [value]="timeOption.value">{{
                timeOption.viewValue
              }}</mat-option>
              }
            </mat-select>
          </mat-form-field>
        </mat-card-content>
        <!-- ITEMS TABLE  -->
        <mat-card-footer class="example-card-footer">
          @if (displayedItems()?.items?.length) {
          <table
            mat-table
            [dataSource]="displayedItems()!.items"
            class="mat-elevation-z8"
          >
            <ng-container matColumnDef="productName">
              <th mat-header-cell *matHeaderCellDef>{{ item_name }}</th>
              <td mat-cell *matCellDef="let element">
                {{ element.productName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="lot">
              <th mat-header-cell *matHeaderCellDef>{{ lot_number }}</th>
              <td mat-cell *matCellDef="let element">{{ element.lot }}</td>
            </ng-container>

            <ng-container matColumnDef="employee">
              <th mat-header-cell *matHeaderCellDef>{{ employee }}</th>
              <td mat-cell *matCellDef="let element">
                {{ element.expand?.employee?.firstName }}
                {{ element.expand?.employee?.lastName }}
              </td>
            </ng-container>

            <ng-container matColumnDef="project">
              <th mat-header-cell *matHeaderCellDef>{{ project }}</th>
              <td mat-cell *matCellDef="let element">
                {{ element.expand?.project?.name }}
              </td>
            </ng-container>

            <ng-container matColumnDef="issueTime">
              <th mat-header-cell *matHeaderCellDef>{{ issue_time }}</th>
              <td mat-cell *matCellDef="let element">
                {{ element.created | date : 'short' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="quantity">
              <th mat-header-cell *matHeaderCellDef>{{ quantity }}</th>
              <td mat-cell *matCellDef="let element">{{ element.quantity }}</td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>
          } @else {
          <p>{{ no_items }}</p>
          }
        </mat-card-footer>
      </mat-card>
      <!-- PROJECTS  -->

      <div class="row">
        <h3>
          {{ projects }}
        </h3>
        <button (click)="createProject()" mat-stroked-button>
          {{ create_project }}
        </button>
      </div>
      @for (project of projectsData()?.items; track project.name) {
      <mat-card class="example-card" appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ project.name }}</mat-card-title>
          <div class="gap">
            <button (click)="editProject(project)" mat-stroked-button>
              {{ edit }}
            </button>
            <button
              class="danger"
              (click)="deleteProject(project)"
              mat-stroked-button
            >
              {{ delete }}
            </button>
          </div>
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
              <span class="bold">{{ project.spent.toFixed(2) }}</span> /
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
    '.full {display: flex; justify-content: end; gap: 16px; width: 100vw; max-width: 1024px; margin: 8px 1rem;}',
    '.wrap {display: flex; flex-direction: column; justify-content: space-between; gap: 16px; width: 100vw; max-width: 1024px; margin: 1rem;}',
    '.example-card-footer {display: flex; flex-direction: row; padding: 16px; gap: 8px;}',
    '.gap {display: flex; gap: 8px}',
    'mat-card-title {font-size: 20px; font-weight: 600}',
    'mat-card-header {display: flex; flex-direction: row; justify-content: space-between; gap: 16px; width: calc(100% - 2rem) }',
    'h3 {margin: 0}',
    '.danger {color: red}',
    '.row {display: flex;flex-direction: row; justify-content: space-between; align-items: center; margin-top: 18px}',
    'table { width: 100%; }',
    'th.mat-header-cell, td.mat-cell { padding: 8px; }',
    '.mat-elevation-z8 { box-shadow: 0 2px 8px rgba(0,0,0,0.15); }',
  ],
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  authService: AuthService = inject(AuthService);
  router: Router = inject(Router);
  private dialog = inject(MatDialog);
  private getProjectsService = inject(GetProjectsService);
  private getItemsService = inject(GetItemsService);

  public selectedProject = signal<Project | null>(null);

  projectsData = computed(() => this.getProjectsService.projectsData());
  allItems = computed(() => this.getItemsService.allItems());
  displayedItems = signal<Items | null>(this.allItems());
  displayedColumns: string[] = [
    'productName',
    'lot',
    'employee',
    'project',
    'issueTime',
    'quantity',
  ];

  isLoggedIn: boolean = false;
  userName: string = '';
  loggedInStatusSub?: Subscription;

  itemCount = 3;

  log_out = 'Atsijungti';
  projects = 'Projektai';
  no_projects = 'Nėra aktyvių projektų.';
  owner = 'Savininkas:';
  budget = 'Biudžetas:';
  edit = 'Redaguoti';
  delete = 'Ištrinti';

  edit_project = 'Redaguoti projektą';
  delete_project = 'Ištrinti projektą';
  create_project = 'Sukurti projektą';
  final = 'Šis veiksmas galutinis ir neatšaukiamas. Ar tikrai norite tęsti?';
  journal = 'Žurnalas';
  filters = 'Filtrai';
  clear_all = 'Išvalyti visus';
  export_pdf = 'Eksportuoti į PDF';
  lot = 'Partijos numeris';
  all_lots = 'Visos partijos';

  item_name = 'Prekės pavadinimas';
  name = 'Pavadinimas';
  lot_number = 'Partijos numeris';
  employee = 'Darbuotojas';
  project = 'Projektas';
  issue_time = 'Išdavimo laikas';
  quantity = 'Kiekis';
  no_items = 'Nėra prekių.';
  employee_filter = 'Darbuotojas';
  all_employees = 'Visi darbuotojai';
  time_filter = 'Laikas';
  all_time = 'Visas laikas';
  last_hour = 'Paskutinė valanda';
  last_day = 'Paskutinė diena';
  last_week = 'Paskutinė savaitė';
  last_month = 'Paskutinis mėnuo';

  default_lot = 0;
  default_employee = 0;
  default_timeFilter = 'all';
  lots = signal<SelectItem[]>([{ id: 0, viewValue: this.all_lots }]);
  employees = signal<SelectItem[]>([{ id: 0, viewValue: this.all_employees }]);
  timeFilterOptions: SelectItem[] = [
    { value: 'all', viewValue: this.all_time },
    { value: 'hour', viewValue: this.last_hour },
    { value: 'day', viewValue: this.last_day },
    { value: 'week', viewValue: this.last_week },
    { value: 'month', viewValue: this.last_month },
  ];

  logOut() {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }

  ngOnInit() {
    this.getProjectsService.fetchProjectsData(this.itemCount, 1).subscribe();
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

    this.getItemsService.fetchItems().subscribe({
      next: (data) => {
        if (data && data.items) {
          const uniqueLots = new Set<number>();
          const uniqueEmployees = new Map<number, string>();

          data.items.forEach((item) => {
            if (item.lot) {
              uniqueLots.add(item.lot);
            }
            if (item.expand?.employee) {
              const employee = item.expand.employee;
              uniqueEmployees.set(
                Number(employee.id),
                `${employee.firstName} ${employee.lastName}`
              );
            }
          });

          const sortedLots = Array.from(uniqueLots).sort((a, b) => a - b);

          const lotOptions: SelectItem[] = [
            { id: 0, viewValue: this.all_lots },
            ...sortedLots.map((lot) => ({
              id: lot,
              viewValue: lot.toString(),
            })),
          ];

          const employeeOptions: SelectItem[] = [
            { id: 0, viewValue: this.all_employees },
            ...Array.from(uniqueEmployees).map(([id, name]) => ({
              id,
              viewValue: name,
            })),
          ];

          this.lots.set(lotOptions);
          this.employees.set(employeeOptions);
          this.displayedItems.set(data);
        }
      },
      error: (error) => {
        console.error('Error fetching items:', error);
      },
    });
  }

  ngOnDestroy() {
    this.loggedInStatusSub?.unsubscribe();
  }

  selectProject(project: Project) {
    this.selectedProject.set(project);
    console.log('Selected project: ', project);
  }

  pageChanged(event: PageEvent) {
    const newPage = event.pageIndex + 1;
    this.getProjectsService
      .fetchProjectsData(this.itemCount, newPage)
      .subscribe();
  }

  openACPDialog(title: string, msg: string, view: string) {
    const dialogRef = this.dialog.open(AcpDialogComponent, {
      data: {
        title: title,
        message: msg,
        project: this.selectedProject(),
        updateView: (updateDisplay: UpdateDisplayFunction) =>
          updateDisplay(view),
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.getProjectsService.fetchProjectsData(this.itemCount, 1).subscribe();
      this.selectedProject.set(null);
    });
  }

  editProject(proj: Project) {
    this.selectProject(proj);
    this.openACPDialog(this.edit_project, '', 'editProject');
  }

  deleteProject(proj: Project) {
    this.selectProject(proj);
    this.openACPDialog(this.delete_project, this.final, 'deleteProject');
  }

  createProject() {
    this.openACPDialog(this.create_project, '', 'createProject');
  }

  filterItems() {
    const allItems = this.allItems();
    if (!allItems) return;

    let filteredItems = allItems.items;

    if (this.default_lot !== 0) {
      filteredItems = filteredItems.filter(
        (item) => item.lot === this.default_lot
      );
    }

    if (this.default_employee !== 0) {
      filteredItems = filteredItems.filter(
        (item) => Number(item.expand?.employee?.id) === this.default_employee
      );
    }

    if (this.default_timeFilter !== 'all') {
      const now = new Date();
      let filterDate = new Date();

      switch (this.default_timeFilter) {
        case 'hour':
          filterDate.setHours(now.getHours() - 1);
          break;
        case 'day':
          filterDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
      }

      filteredItems = filteredItems.filter((item) => {
        if (!item.created) return false;
        const itemDate = new Date(item.created);
        return itemDate >= filterDate && itemDate <= now;
      });
    }

    this.displayedItems.set({
      items: filteredItems,
      page: 1,
      perPage: filteredItems.length,
      totalItems: filteredItems.length,
      totalPages: 1,
    });
  }

  clearFilters() {
    this.default_lot = 0;
    this.default_employee = 0;
    this.default_timeFilter = 'all';
    this.filterItems();
  }

  exportToPDF() {
    const doc = new jsPDF();

    doc.text('Produktų žurnalas', 14, 15);

    const columns = [
      { header: this.name, dataKey: 'productName' },
      { header: this.lot_number, dataKey: 'lot' },
      { header: this.employee, dataKey: 'employee' },
      { header: this.project, dataKey: 'project' },
      { header: this.issue_time, dataKey: 'issueTime' },
      { header: this.quantity, dataKey: 'quantity' },
    ];

    const data =
      this.displayedItems()?.items.map((item) => ({
        productName: item.productName,
        lot: item.lot,
        employee: item.expand?.employee
          ? `${item.expand.employee.firstName} ${item.expand.employee.lastName}`
          : '',
        project: item.expand?.project?.name || '',
        issueTime: item.created ? new Date(item.created).toLocaleString() : '',
        quantity: item.quantity,
      })) || [];

    autoTable(doc, {
      columns: columns,
      body: data,
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 40 },
        1: { cellWidth: 20 },
        2: { cellWidth: 30 },
        3: { cellWidth: 30 },
        4: { cellWidth: 40 },
        5: { cellWidth: 20 },
      },
    });

    doc.save('items-report.pdf');
  }
}
