import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, catchError } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { Projects } from '../../interfaces/all';

@Injectable({
  providedIn: 'root',
})
export class GetProjectsService {
  private baseUrl = environment.baseUrl;
  public projectsData = signal<Projects | null>(null);

  constructor(private http: HttpClient) {}

  public fetchProjectsData(): Observable<Projects> {
    const perPage = 3;
    const url = `${this.baseUrl}/api/collections/projects/records?perPage=${perPage}`;
    return this.http.get<Projects>(url).pipe(
      tap((data) => {
        console.log('Projects data:', data);
        this.projectsData.set(data as Projects);
      }),
      catchError((error) => {
        console.error('Error fetching projects data:', error);
        this.projectsData.set(null);
        throw error;
      })
    );
  }
}
