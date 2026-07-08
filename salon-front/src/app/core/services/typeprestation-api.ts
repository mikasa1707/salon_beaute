import { Injectable } from '@angular/core';
import { TypePrestation } from '../models/prestation';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class TypeprestationApi {
    private apiUrl = `${environment.apiUrl}/types-prestations`;

  constructor(private http: HttpClient) {}

  getAll(): Observable<TypePrestation[]> {
    return this.http.get<TypePrestation[]>(this.apiUrl);
  }

  findAll(page = 1, limit = 10, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<TypePrestation> {
    return this.http.get<TypePrestation>(`${this.apiUrl}/${id}`);
  }

  create(typePrestation: Partial<TypePrestation>): Observable<TypePrestation> {
    return this.http.post<TypePrestation>(this.apiUrl, typePrestation);
  }

  update(id: number, typePrestation: Partial<TypePrestation>): Observable<TypePrestation> {
    return this.http.patch<TypePrestation>(`${this.apiUrl}/${id}`, typePrestation);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
