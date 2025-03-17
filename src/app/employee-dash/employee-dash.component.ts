import {
  Component,
  inject,
  computed,
  OnInit,
  signal,
  ViewChild,
  ElementRef,
  ChangeDetectionStrategy,
} from '@angular/core';
import { GetEmployeeService } from '../shared/services/get-employee.service';
import { GetProjectsService } from '../shared/services/get-projects.service';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { Project, WarehouseProducts } from '../interfaces/all';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import {
  FormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  AbstractControl,
  ValidatorFn,
} from '@angular/forms';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { GetProductsService } from '../shared/services/get-products.service';
import { MatTableModule } from '@angular/material/table';
import { ClientResponseError } from 'pocketbase';
import { ConfirmDialogComponent } from '../confirm-dialog';
import { MatExpansionModule } from '@angular/material/expansion';

type UpdateDisplayFunction = (display: string) => void;

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
    MatTableModule,
    MatButtonModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatExpansionModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
      } } @else {
      <!-- SELECTED PROJECT  -->
      <mat-card appearance="outlined">
        <mat-card-header>
          <mat-card-title>{{ selectedProject()?.name }}</mat-card-title>
          <button (click)="clearProject()" mat-stroked-button>
            {{ cancel }}
          </button>
        </mat-card-header>
        <mat-card-content>
          <!-- PRODUCT STEPPER -->
          <mat-stepper orientation="vertical" [linear]="true" #stepper>
            <mat-step [stepControl]="firstFormGroup">
              <form [formGroup]="firstFormGroup">
                <ng-template matStepLabel>{{ enter_product_code }}</ng-template>
                <mat-form-field>
                  <input
                    matInput
                    formControlName="firstCtrl"
                    required
                    type="number"
                  />
                  @if (firstFormGroup.get('firstCtrl')?.hasError('required')) {
                  <mat-error>
                    {{ must_enter_product_code }}
                  </mat-error>
                  } @if
                  (firstFormGroup.get('firstCtrl')?.hasError('invalidProductCode'))
                  {
                  <mat-error>{{ invalid_product_code }}</mat-error>
                  }
                </mat-form-field>
                <button
                  mat-stroked-button
                  matStepperNext
                  [disabled]="!firstFormGroup.valid"
                >
                  {{ continue }}
                </button>
              </form>
            </mat-step>
            <mat-step [stepControl]="secondFormGroup">
              <form [formGroup]="secondFormGroup">
                <ng-template matStepLabel>{{ enter_lot_number }}</ng-template>
                <mat-form-field>
                  <input
                    matInput
                    formControlName="secondCtrl"
                    required
                    type="number"
                  />
                  @if (secondFormGroup.get('secondCtrl')?.hasError('required')
                  && secondFormGroup.get('secondCtrl')?.touched) {
                  <mat-error>
                    {{ must_enter_lot_number }}
                  </mat-error>
                  } @if
                  (secondFormGroup.get('secondCtrl')?.hasError('invalidSixDigit')
                  && secondFormGroup.get('secondCtrl')?.touched) {
                  <mat-error>
                    {{ lot_number_must_be_six_digits }}
                  </mat-error>
                  }
                </mat-form-field>
                <div>
                  <button
                    mat-button
                    matStepperNext
                    [disabled]="!secondFormGroup.valid"
                  >
                    {{ continue }}
                  </button>
                </div>
              </form>
            </mat-step>
            <mat-step [stepControl]="thirdFormGroup">
              <form [formGroup]="thirdFormGroup">
                <ng-template matStepLabel>{{ enter_quantity }}</ng-template>
                <mat-form-field>
                  <input
                    matInput
                    formControlName="thirdCtrl"
                    type="number"
                    required
                  />
                  <mat-hint>
                    {{ available_stock }}:
                    {{ getSelectedProductStock() }}
                  </mat-hint>
                  @if (thirdFormGroup.get('thirdCtrl')?.hasError('required') &&
                  thirdFormGroup.get('thirdCtrl')?.touched) {
                  <mat-error>
                    {{ must_enter_quantity }}
                  </mat-error>
                  } @if
                  (thirdFormGroup.get('thirdCtrl')?.hasError('invalidQuantity')
                  && thirdFormGroup.get('thirdCtrl')?.touched) {
                  <mat-error>
                    {{ quantity_must_be_positive }}
                  </mat-error>
                  } @if
                  (thirdFormGroup.get('thirdCtrl')?.hasError('exceedsStock') &&
                  thirdFormGroup.get('thirdCtrl')?.touched) {
                  <mat-error>
                    {{ quantity_exceeds_stock }}
                  </mat-error>
                  }
                </mat-form-field>
                <div>
                  <button
                    mat-button
                    matStepperNext
                    [disabled]="!thirdFormGroup.valid"
                    (click)="setProduct()"
                  >
                    {{ continue }}
                  </button>
                </div>
              </form>
            </mat-step>
          </mat-stepper>
          <!-- PROJECT PRODUCTS -->
          @if(selectedProject()?.expand?.items?.length ?? 0 > 0) {
          <mat-accordion>
            <mat-expansion-panel expanded="true">
              <mat-expansion-panel-header>
                <mat-panel-title> {{ project_products }} </mat-panel-title>
              </mat-expansion-panel-header>
              <div class="items">
                <span class="text bold">{{ item_name }}</span>
                <span class="text bold">{{ item_quantity }}</span>
                <span class="text bold">{{ item_lot }}</span>
              </div>
              @for (item of selectedProject()?.expand?.items; track item.id) {
              <div class="items">
                <span class="text ">{{ item.productName }}</span>
                <span class="text ">{{ item.quantity }}</span>
                <span class="text ">{{ item.lot }}</span>
              </div>
              }
            </mat-expansion-panel>
          </mat-accordion>
          }
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
              <span class="bold">{{
                selectedProject()?.spent?.toFixed(2)
              }}</span>
              /
              <span class="bold">
                {{ selectedProject()?.budget }}
                {{ selectedProject()?.currency }}
              </span>
            </mat-chip>
          </mat-chip-set>
        </mat-card-footer>
      </mat-card>
      <!-- INFO CARD -->
      <span class="bold"> {{ available_items }}</span>
      <mat-card class="info" appearance="outlined">
        @if(products() != null) {
        <table mat-table [dataSource]="tableData" class="mat-elevation-z8">
          <ng-container matColumnDef="id">
            <th mat-header-cell *matHeaderCellDef>ID</th>
            <td mat-cell *matCellDef="let element">{{ element.id }}</td>
          </ng-container>

          <ng-container matColumnDef="productName">
            <th mat-header-cell *matHeaderCellDef>{{ name }}</th>
            <td mat-cell *matCellDef="let element">
              {{ element.productName }}
            </td>
          </ng-container>

          <ng-container matColumnDef="productCode">
            <th mat-header-cell *matHeaderCellDef>{{ code }}</th>
            <td mat-cell *matCellDef="let element">
              {{ element.productCode }}
            </td>
          </ng-container>

          <ng-container matColumnDef="stockQuantity">
            <th mat-header-cell *matHeaderCellDef>{{ quantity }}</th>
            <td mat-cell *matCellDef="let element">
              {{ element.stockQuantity }}
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
        </table>
        }
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
    '.bold {font-weight: 600;}',
    '.ml {margin-left: 2rem;}',
    'table {border-radius: 8px;}',
    'mat-stepper, mat-form-field {margin-top: 1rem}',
    'form {display: flex;flex-direction: row; align-items:center; gap: 1rem;}',
    '.items {display: flex; flex-direction: row; width: 100%;}',
    '.text {flex:1}',
  ],
})
export class EmployeeDashComponent implements OnInit {
  private getEmployeeService = inject(GetEmployeeService);
  private getProjectsService = inject(GetProjectsService);
  private getProductsService = inject(GetProductsService);
  public selectedProject = signal<Project | null>(null);
  public warehouseProducts = signal<WarehouseProducts | null>(null);
  private _formBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  readonly panelOpenState = signal(false);

  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  thirdFormGroup = this._formBuilder.group({
    thirdCtrl: ['', Validators.required],
  });

  employeeData = computed(() => this.getEmployeeService.employeeData());
  projectsData = computed(() => this.getProjectsService.projectsData());

  products = signal<WarehouseProducts | null>(null);
  displayedColumns: string[] = ['productCode', 'productName', 'stockQuantity'];

  selectedProductCode: string | null = null;
  selectedProductStockQuantity: number = 0;

  get tableData(): any[] {
    return this.products()?.items || [];
  }

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
  item_name = 'Pavadinimas';
  item_quantity = 'Kiekis';
  item_lot = 'Partijos nr';

  available_items = 'Galimos prekės:';
  no_products = 'Nėra produktų.';
  name = 'Pavadinimas';
  code = 'Kodas';
  quantity = 'Likutis';
  enter_product_code = 'Įveskite produkto kodą';
  enter_lot_number = 'Įveskite partijos numerį (6 skaitmenys)';
  enter_quantity = 'Įveskite kiekį';
  continue = 'Tęsti';
  must_enter_product_code = 'Būtina įvesti produkto kodą';
  must_enter_lot_number = 'Būtina įvesti partijos numerį';
  must_enter_quantity = 'Būtina įvesti kiekį';

  invalid_product_code = 'Netinkamas produkto kodas';
  lot_number_must_be_six_digits = 'Partijos numeris turi būti 6 skaitmenys';
  quantity_must_be_positive = 'Kiekis turi būti teigiamas skaičius';
  quantity_exceeds_stock = 'Kiekis viršija turimą likutį';
  available_stock = 'Likutis sandėlyje';

  project_products = 'Projekto prekės:';

  itemCount = 3;

  ngOnInit() {
    this.getProjectsService.fetchProjectsData(this.itemCount, 1).subscribe();

    this.getProductsService.fetchWarehouseProducts().subscribe({
      next: (data: WarehouseProducts) => {
        this.products.set(data as WarehouseProducts);

        this.firstFormGroup = this._formBuilder.group({
          firstCtrl: [
            '',
            [Validators.required, productCodeValidator(this.products())],
          ],
        });
        this.secondFormGroup = this._formBuilder.group({
          secondCtrl: ['', [Validators.required, sixDigitValidator()]],
        });
        this.thirdFormGroup = this._formBuilder.group({
          thirdCtrl: ['', [Validators.required]],
        });
        this.initForm();
      },
      error: (err: ClientResponseError) => {
        console.log(err);
      },
    });
  }

  initForm() {
    this.firstFormGroup
      .get('firstCtrl')
      ?.setValidators([
        Validators.required,
        productCodeValidator(this.products()),
      ]);
    this.firstFormGroup.get('firstCtrl')?.updateValueAndValidity();

    this.firstFormGroup.get('firstCtrl')?.valueChanges.subscribe((value) => {
      this.selectedProductCode = value;
      this.updateThirdFormGroupValidator();
    });
  }

  updateThirdFormGroupValidator() {
    this.thirdFormGroup
      .get('thirdCtrl')
      ?.setValidators([
        Validators.required,
        quantityValidator(this.products(), this.selectedProductCode),
      ]);
    this.thirdFormGroup.get('thirdCtrl')?.updateValueAndValidity();
  }

  getSelectedProductStock(): number {
    if (!this.products() || !this.selectedProductCode) {
      return 0;
    }
    const selectedProduct = this.products()?.items.find(
      (item) => Number(item.productCode) === Number(this.selectedProductCode)
    );
    return selectedProduct ? selectedProduct.stockQuantity : 0;
  }

  pageChanged(event: PageEvent) {
    const newPage = event.pageIndex + 1;
    this.getProjectsService
      .fetchProjectsData(this.itemCount, newPage)
      .subscribe();
  }

  selectProject(project: Project) {
    this.selectedProject.set(project);
    console.log('Selected project: ', project);
  }

  clearProject() {
    this.selectedProject.set(null);
    this.firstFormGroup.get('firstCtrl')?.setValue('');
    this.secondFormGroup.get('secondCtrl')?.setValue('');
    this.thirdFormGroup.get('thirdCtrl')?.setValue('');
  }

  setProduct() {
    this.openDialog();
  }

  openDialog() {
    const foundProduct = this.products()?.items.find(
      (item) => Number(item.productCode) === Number(this.selectedProductCode)
    );

    const productName = foundProduct
      ? foundProduct.productName
      : 'Nežinomas produktas';

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Pridėti produktą',
        message: `${productName} (${this.selectedProductCode}) * ${
          this.thirdFormGroup.get('thirdCtrl')?.value
        }`,
        UID: this.employeeData()?.id,
        onConfirm: (updateDisplay: UpdateDisplayFunction) =>
          this.addProduct(updateDisplay),
        onCancel: (updateDisplay: UpdateDisplayFunction) =>
          this.cancelAddition(updateDisplay),

        item: foundProduct,
        project: this.selectedProject(),
        employee: this.employeeData(),
        quantity: this.thirdFormGroup.get('thirdCtrl')?.value,
        lot: this.secondFormGroup.get('secondCtrl')?.value,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe(() => {
      this.clearProject();
      this.getProjectsService.fetchProjectsData(this.itemCount, 1).subscribe();
    });
  }

  addProduct(updateDisplay: UpdateDisplayFunction) {
    updateDisplay('confirm');
  }

  cancelAddition(updateDisplay: UpdateDisplayFunction) {
    updateDisplay('cancelled');
  }
}

// VALIDATORS

export function productCodeValidator(
  products: WarehouseProducts | null
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!products || !control.value) {
      return null;
    }
    const isValid = products.items.some((item) => {
      return Number(item.productCode) === control.value;
    });
    return isValid ? null : { invalidProductCode: { value: control.value } };
  };
}

export function sixDigitValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const valid = /^\d{6}$/.test(control.value);
    return valid ? null : { invalidSixDigit: { value: control.value } };
  };
}

export function quantityValidator(
  products: WarehouseProducts | null,
  selectedProductCode: string | null
): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!products || !control.value || !selectedProductCode) {
      return null;
    }
    const selectedProduct = products.items.find(
      (item) => Number(item.productCode) === Number(selectedProductCode)
    );
    if (!selectedProduct) {
      return { productNotFound: true };
    }
    const enteredQuantity = Number(control.value);
    if (isNaN(enteredQuantity) || enteredQuantity <= 0) {
      return { invalidQuantity: true };
    }
    if (enteredQuantity > selectedProduct.stockQuantity) {
      return {
        exceedsStock: {
          max: selectedProduct.stockQuantity,
          actual: enteredQuantity,
        },
      };
    }
    return null;
  };
}
