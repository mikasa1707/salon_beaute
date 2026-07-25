import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CashRegister } from '../models/cash-register';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class CashRegisterApi {
  constructor(private http: HttpClient) {}
  private apiUrl = `${environment.apiUrl}/cash-register`;

  current() {
    return this.http.get<any>(this.apiUrl + '/current');
  }

  summary(id: number) {
    return this.http.get<any>(this.apiUrl + `/${id}/summary`);
  }

  open(balance: number) {
    return this.http.post('/open', {
      openingBalance: balance,
    });
  }

  close(id: number, balance: number) {
    return this.http.post(this.apiUrl + `/close/${id}`, {
      countedBalance: balance,
    });
  }

  history() {
    return this.http.get<any[]>(this.apiUrl + '/history');
  }
}
