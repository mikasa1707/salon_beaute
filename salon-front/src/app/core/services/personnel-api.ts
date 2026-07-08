import { Injectable, Service } from '@angular/core';
import { environment } from '../../../environnements/environnement';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Personnel } from '../models/personnel';

@Injectable({
  providedIn: 'root',
})
export class PersonnelApi {
  private apiUrl = `${environment.apiUrl}/personnels`;

  constructor(private http: HttpClient) {}

  findAll(page = 1, limit = 10, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<any>(this.apiUrl, { params });
  }

  findOne(id: number): Observable<Personnel> {
    return this.http.get<Personnel>(`${this.apiUrl}/${id}`);
  }

  create(personnel: Partial<Personnel>): Observable<Personnel> {
    return this.http.post<Personnel>(this.apiUrl, personnel);
  }

  update(id: number, personnel: Partial<Personnel>): Observable<Personnel> {
    return this.http.patch<Personnel>(`${this.apiUrl}/${id}`, personnel);
  }

  remove(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
