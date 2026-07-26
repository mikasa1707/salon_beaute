import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';

import { environment } from '../../../environnements/environnement';

import { CashMovement, CreateCashMovement } from '../models/cash-movement';

@Injectable({
  providedIn: 'root',
})
export class CashMovementApi {
  private readonly apiUrl = `${environment.apiUrl}/cash-movements`;

  constructor(private readonly http: HttpClient) {}

  findCurrent(page = 1, limit = 10, search = ''): Observable<CashMovement> {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);

    return this.http.get<CashMovement>(`${this.apiUrl}/current`, { params });
  }

  findByCashRegister(cashRegisterId: number, page = 1, limit = 10, search = ''): Observable<any> {
    const params = new HttpParams().set('page', page).set('limit', limit).set('search', search);

    return this.http.get<any>(`${this.apiUrl}/${cashRegisterId}`, { params });
  }

  findOne(id: number): Observable<CashMovement> {
    return this.http.get<CashMovement>(`${this.apiUrl}/detail/${id}`);
  }

  create(cashRegisterId: number, dto: CreateCashMovement): Observable<CashMovement> {
    return this.http.post<CashMovement>(`${this.apiUrl}/${cashRegisterId}`, dto);
  }
}
