import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginScreenComponent } from '../login-screen/login-screen.component';
import { EmployeeDashComponent } from '../employee-dash/employee-dash.component';
import { GetEmployeeService } from '../shared/services/get-employee.service';

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, LoginScreenComponent, EmployeeDashComponent],
  template: `
    @if (employeeData() === null) {
    <app-login-screen />
    } @else {
    <app-employee-dash />
    }
  `,
  styles: [],
})
export class TerminalComponent {
  private getEmployeeService = inject(GetEmployeeService);
  employeeData = computed(() => this.getEmployeeService.employeeData());
}
