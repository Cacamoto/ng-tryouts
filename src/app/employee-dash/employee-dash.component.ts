import { Component, inject, computed } from '@angular/core';
import { GetEmployeeService } from '../shared/services/get-employee.service';
import { Employee } from '../interfaces/all';

@Component({
  selector: 'app-employee-dash',
  imports: [],
  template: `
    <div class="wrap">
      {{ greet }}, {{ employeeData()?.firstName }}
      {{ employeeData()?.lastName }}!
    </div>
  `,
  styles: [
    '.wrap {display: flex; flex-direction: row; gap: 16px; width: 100vw; max-width: 768px;}',
  ],
})
export class EmployeeDashComponent {
  private getEmployeeService = inject(GetEmployeeService);

  employeeData = computed(() => this.getEmployeeService.employeeData());

  greet = 'Sveiki';
}
