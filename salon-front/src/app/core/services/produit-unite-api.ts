import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environnements/environnement';
import { ProduitUnite } from '../models/produit-unite';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProduitUniteApi {
  private api = environment.apiUrl + '/produit-unite';

  constructor(private http: HttpClient) {}

  findAll(page = 1, limit = 16, search = '', filter?: number | null): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }

    if (filter) {
      params = params.set('typeProduitId', filter);
    }

    return this.http.get<any>(`${this.api}/unites`, { params });
  }

  findbyProduit(produitId: number, page = 1, limit = 10, search = '') {
    return this.http.get<any>(`${this.api}/${produitId}/unites`, {
      params: { page, limit, search },
    });
  }

  findOne(id: number) {
    return this.http.get<ProduitUnite>(`${this.api}/${id}`);
  }

  create(dto: any) {
    return this.http.post<ProduitUnite>(this.api, dto);
  }

  update(id: number, dto: any) {
    return this.http.patch<ProduitUnite>(`${this.api}/${id}`, dto);
  }

  remove(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  findUnites(page = 1, limit = 10, search = ''): Observable<any> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    return this.http.get<any>(`${this.api}`, { params });
  }

  findAllByType(typeProduitId: number, page = 1, limit = 10, search = '') {
    return this.http.get<any[]>(`${this.api}/by-type/${typeProduitId}`, {
      params: { page, limit, search },
    })
  }
}
