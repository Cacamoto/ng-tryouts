import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { Observable, tap, catchError } from 'rxjs';
import { Item, Items } from '../../interfaces/all';

@Injectable({
  providedIn: 'root',
})
export class GetItemsService {
  private baseUrl = environment.baseUrl;
  public allItems = signal<Items | null>(null);

  constructor(private http: HttpClient) {}

  public fetchItems() {
    const url = `${this.baseUrl}/api/collections/items/records?expand=project,employee`;
    return this.http.get<Items>(url).pipe(
      tap((data: Items) => {
        console.log('Items data:', data);
        this.allItems.set(data as Items);
      }),
      catchError((error) => {
        console.error('Error fetching items data:', error);
        this.allItems.set(null);
        throw error;
      })
    );
  }
}
