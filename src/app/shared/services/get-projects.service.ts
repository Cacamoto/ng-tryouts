import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private getHeaders(): HttpHeaders {
    const authData = localStorage.getItem('pocketbase_auth');
    let token = null;
    if (authData) {
      token = JSON.parse(authData).token;
    }
    return new HttpHeaders().set('Authorization', `Bearer ${token}`);
  }

  public fetchProjectsData(
    itemCount: number,
    page: number
  ): Observable<Projects> {
    const perPage = itemCount;
    const url = `${this.baseUrl}/api/collections/projects/records?perPage=${perPage}&page=${page}&expand=items`;
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

  public createProject(data: {
    name: string;
    owner: string;
    budget: number;
    currency: string;
  }) {
    const url = `${this.baseUrl}/api/collections/projects/records`;
    return this.http.post(url, data, { headers: this.getHeaders() }).pipe(
      tap((data) => {
        console.log('Project created:', data);
      }),
      catchError((error) => {
        console.error('Error creating project:', error);
        this.projectsData.set(null);
        throw error;
      })
    );
  }

  public updateProject(
    id: number,
    data: {
      name: string;
      owner: string;
      budget: number;
    }
  ) {
    const url = `${this.baseUrl}/api/collections/projects/records/${id}`;
    return this.http.patch(url, data, { headers: this.getHeaders() }).pipe(
      tap((data) => {
        console.log('Project updated:', data);
      }),
      catchError((error) => {
        console.error('Error updating project:', error);
        this.projectsData.set(null);
        throw error;
      })
    );
  }

  public deleteProject(id: number) {
    const url = `${this.baseUrl}/api/collections/projects/records/${id}`;
    return this.http.delete(url, { headers: this.getHeaders() }).pipe(
      tap(() => {
        console.log('Project deleted.');
      }),
      catchError((error) => {
        console.error('Error updating project:', error);
        this.projectsData.set(null);
        throw error;
      })
    );
  }
}
