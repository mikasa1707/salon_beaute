import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Facturation } from '../models/facturation';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class FacturationApiService {
  private apiUrl = `${environment.apiUrl}/facturations`;

  constructor(private http: HttpClient) {}

  findAll(page = 1, limit = 10, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<any> {
    return this.http.get<Facturation>(`${this.apiUrl}/${id}`);
  }

  createFromReservation(reservationId: number): Observable<any> {
    return this.http.post<Facturation>(`${this.apiUrl}/reservation/${reservationId}`, {});
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
