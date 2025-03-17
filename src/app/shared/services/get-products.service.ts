import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { WarehouseProducts } from '../../interfaces/all';

@Injectable({
  providedIn: 'root',
})
export class GetProductsService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) {}

  public fetchWarehouseProducts() {
    const url = `${this.baseUrl}/api/collections/warehouse_products/records`;
    return this.http.get<WarehouseProducts>(url);
  }
}
