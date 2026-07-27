import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnement';
import { CashRegister } from '../models/cash-register';

@Injectable({
  providedIn: 'root',
})
export class CashRegisterApi {
  private apiUrl = `${environment.apiUrl}/cash-register`;

  constructor(private http: HttpClient) {}

  current() {
    return this.http.get<CashRegister>(`${this.apiUrl}/current`);
  }

  summary(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}/summary`);
  }

  create() {
    return this.http.post<CashRegister>(`${this.apiUrl}/create`, {});
  }

  open(id: number, balance: number) {
    return this.http.post<CashRegister>(`${this.apiUrl}/open/${id}`, {
      openingBalance: balance,
    });
  }

  close(id: number, balance: number) {
    return this.http.post<any>(`${this.apiUrl}/close/${id}`, {
      countedBalance: balance,
    });
  }

  history(page = 1, limit = 10) {
    return this.http.get<any>(`${this.apiUrl}/history`, {
      params: {
        page,
        limit,
      },
    });
  }

  detail(id: number) {
    return this.http.get<any>(`${this.apiUrl}/${id}/detail`);
  }
}
