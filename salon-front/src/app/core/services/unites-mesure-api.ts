import { Injectable, Service } from '@angular/core';
import { UniteMesure } from '../models/unite-mesure';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class UnitesMesureApi {
  private apiUrl = `${environment.apiUrl}/unites-mesure`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<UniteMesure[]> {
    return this.http.get<UniteMesure[]>(this.apiUrl);
  }

  findAll(page = 1, limit = 10, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<UniteMesure> {
    return this.http.get<UniteMesure>(`${this.apiUrl}/${id}`);
  }

  create(unitesMesure: Partial<UniteMesure>): Observable<UniteMesure> {
    return this.http.post<UniteMesure>(this.apiUrl, unitesMesure);
  }

  update(id: number, unitesMesure: Partial<UniteMesure>): Observable<UniteMesure> {
    return this.http.patch<UniteMesure>(`${this.apiUrl}/${id}`, unitesMesure);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
