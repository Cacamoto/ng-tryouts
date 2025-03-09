import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Employee } from '../../interfaces/all';

@Injectable({
  providedIn: 'root',
})
export class GetEmployeeService {
  private baseUrl = environment.baseUrl;
  public employeeData = signal<Employee | null>(null);

  constructor(private http: HttpClient) {}

  public fetchEmployeeData(employeeNo: number): Observable<Employee> {
    const url = `${this.baseUrl}/api/collections/employee/records/${employeeNo}?expand=employeeItems`;
    return this.http.get<Employee>(url).pipe(
      tap((data) => {
        console.log('Employee data:', data);
        this.employeeData.set(data as Employee);
      }),
      catchError((error) => {
        console.error('Error fetching employee data:', error);
        this.employeeData.set(null);
        throw error;
      })
    );
  }
}
