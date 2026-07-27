import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { StockConsumption } from '../models/stock-consumption';
import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environnement';

export interface PaginatedStockConsumption {
  data: StockConsumption[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root',
})
export class StockConsumptionApi {
  private readonly url = `${environment.apiUrl}/stock-consumptions`;

  constructor(private readonly http: HttpClient) {}

  findAll(page = 1, limit = 10, search = ''): Observable<PaginatedStockConsumption> {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);

    return this.http.get<PaginatedStockConsumption>(this.url, {
      params,
    });
  }

  findOne(id: number): Observable<StockConsumption> {
    return this.http.get<StockConsumption>(`${this.url}/${id}`);
  }

  create(data: Partial<StockConsumption>): Observable<StockConsumption> {
    return this.http.post<StockConsumption>(this.url, data);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
