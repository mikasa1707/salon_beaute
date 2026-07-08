import { Injectable, Service } from '@angular/core';
import { environment } from '../../../environnements/environnement';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Prestation } from '../models/prestation';

@Injectable({
  providedIn: 'root',
})
export class PrestationApi {
  private apiUrl = `${environment.apiUrl}/prestations`;

  constructor(private http: HttpClient) {}

  findAll(page = 1, limit = 10, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<Prestation> {
    return this.http.get<Prestation>(`${this.apiUrl}/${id}`);
  }

  create(prestation: Partial<Prestation>): Observable<Prestation> {
    return this.http.post<Prestation>(this.apiUrl, prestation);
  }

  update(id: number, prestation: Partial<Prestation>): Observable<Prestation> {
    return this.http.patch<Prestation>(`${this.apiUrl}/${id}`, prestation);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
