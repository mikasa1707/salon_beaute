import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class PrestationRecetteApi {
  private api = environment.apiUrl + '/prestations-recettes';

  constructor(private http: HttpClient) {}

  findByPrestation(prestationId: number) {
    return this.http.get<any[]>(`${this.api}/prestation/${prestationId}`);
  }

  create(prestationId: number, data: any) {
    return this.http.post(`${this.api}/prestation/${prestationId}`, data);
  }

  update(id: number, data: any) {
    return this.http.put(`${this.api}/${id}`, data);
  }

  remove(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  createBulk(prestationId: number, data: any) {
    return this.http.post(`${this.api}/prestation/${prestationId}/bulk`, data);
  }
}
