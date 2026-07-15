import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class PrestationProduitApi {
  private api = `${environment.apiUrl}/prestations-produits`;

  constructor(private http: HttpClient) {}

  // findAll() {
  //     return this.http.get<any[]>(
  //         this.api
  //     );
  // }

  findAll(page = 1, limit = 10, search = '') {
    return this.http.get<any>(`${this.api}?page=${page}&limit=${limit}&search=${search}`);
  }

  transfer(data: any) {
    return this.http.post(`${this.api}/transfer`, data);
  }
}
