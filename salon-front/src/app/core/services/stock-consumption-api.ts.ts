import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StockConsumption } from '../models/stock-consumption';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class StockConsumptionApi {
  private readonly url = `${environment.apiUrl}/stock-consumptions`;

  constructor(private readonly http: HttpClient) {}

  findAll(
    page = 1,
    limit = 10,
    search = ''
  ): Observable<{
    data: StockConsumption[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);

    return this.http.get<any>(this.url, {
      params,
    });
  }

  findOne(id: number): Observable<StockConsumption> {
    return this.http.get<StockConsumption>(`${this.url}/${id}`);
  }

  create(data: any): Observable<StockConsumption> {
    return this.http.post<StockConsumption>(this.url, data);
  }

  update(id: number, data: any): Observable<StockConsumption> {
    return this.http.put<StockConsumption>(`${this.url}/${id}`, data);
  }

  archive(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
