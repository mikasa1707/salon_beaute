import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environnement';

import { CreateStockEntryDto, Stock } from '../models/stock';

@Injectable({
  providedIn: 'root',
})
export class StockApi {
  private url = `${environment.apiUrl}/stocks`;

  constructor(private http: HttpClient) {}

  findAll(page = 1, limit = 10, search = '') {
    return this.http.get<any>(`${this.url}/move?page=${page}&limit=${limit}&search=${search}`);
  }

  findAllByproduit(page = 1, limit = 10, search = '', produit_id = 0) {
    return this.http.get<any>(`${this.url}/moveproduct?page=${page}&limit=${limit}&search=${search}&produitUniteId=${produit_id}`);
  }

  findAlerts(): Observable<Stock[]> {
    return this.http.get<Stock[]>(`${this.url}/alerts`);
  }

  entry(data: CreateStockEntryDto): Observable<any> {
    return this.http.post(`${this.url}/entry`, data);
  }
}
