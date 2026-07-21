import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventaire } from '../models/inventaires';
import { CreateInventaireDto } from '../models/inventaire.dto';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class InventaireApi {
  private url = `${environment.apiUrl}/inventaires`;

  constructor(private http: HttpClient) {}

  findAll(page: number = 1, limit: number = 10, search: string = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<any>(this.url, {
      params,
    });
  }

  findOne(id: number): Observable<Inventaire> {
    return this.http.get<Inventaire>(`${this.url}/${id}`);
  }

  create(dto: CreateInventaireDto) {
    return this.http.post<Inventaire>(this.url, dto);
  }

  validate(id: number) {
    return this.http.patch(`${this.url}/${id}/validate`, {});
  }

  remove(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }

  deactivate(id: number) {
    return this.http.patch(`${this.url}/${id}/deactivate`, {});
  }

  update(id: number, dto: any) {
    return this.http.patch(`${this.url}/${id}`, dto);
  }
}
