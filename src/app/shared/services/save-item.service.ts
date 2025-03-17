import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import {
  Employee,
  Item,
  Project,
  WarehouseProduct,
} from '../../interfaces/all';
import { GetProjectsService } from './get-projects.service';

@Injectable({
  providedIn: 'root',
})
export class SaveItemService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}
  private getProjectsService = inject(GetProjectsService);

  public transferItem(
    item: WarehouseProduct,
    project: Project,
    employee: Employee,
    quantity: number,
    lot: number
  ) {
    const itemData = {
      seq: 0,
      productName: item.productName,
      productCode: item.productCode,
      unit: item.unit,
      currency: '€',
      employee: employee.id,
      project: project.id,
      price: item.price,
      quantity: quantity,
      lot: lot,
    };

    const itemPostURL = `${this.baseUrl}/api/collections/items/records`;
    const projectEditURL = `${this.baseUrl}/api/collections/projects/records/${project.id}`;
    const employeeEditURL = `${this.baseUrl}/api/collections/employee/records/${employee.id}`;

    const itemCount = 3;

    this.http.post<Item>(itemPostURL, itemData).subscribe({
      next: (resp) => {
        project.items = project.items || [];
        if (!project.items) {
          project.items = [];
        }
        project.items.push(resp.id?.toString() ?? '');
        project.spent = project.spent + item.price * quantity;

        employee.employeeItems = employee.employeeItems || [];
        if (!employee.employeeItems) {
          employee.employeeItems = [];
        }
        employee.employeeItems.push(resp.id?.toString() ?? '');

        this.http
          .patch(projectEditURL, { items: project.items, spent: project.spent })
          .subscribe({
            next: () => console.log('Project updated successfully'),
            error: (error) => console.error('Error updating project', error),
          });

        this.http
          .patch(employeeEditURL, { employeeItems: employee.employeeItems })
          .subscribe({
            next: () => console.log('Employee updated successfully'),
            error: (error) => console.error('Error updating employee', error),
          });

        this.getProjectsService.fetchProjectsData(itemCount, 1).subscribe();

        console.log('Item saved successfully', resp);
      },
      error: (error) => console.error('Error saving item', error),
    });
  }
}
