import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environnements/environnement';

@Injectable({
  providedIn: 'root',
})
export class VentesApi {
  private url = environment.apiUrl + '/ventes';
  private urldetails = environment.apiUrl + '/vente-produits';

  constructor(private http: HttpClient) {}

  findAll(page = 1, limit = 10, search = '', statutPaiement = '', typeProduitId = null) {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) {
      params = params.set('search', search);
    }
    if (statutPaiement) {
      params = params.set('statutPaiement', statutPaiement);
    }
    if (typeProduitId) {
      params = params.set('typeProduitId', typeProduitId);
    }
    return this.http.get<any>(this.url, {
      params,
    });
  }

  findOne(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  cancel(id: number) {
    return this.http.patch(`${this.url}/${id}/annuler`, {});
  }

  findAllByProduits(page = 1, limit = 10, search = '', venteId = null) {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (search) {
      params = params.set('search', search);
    }
    if (venteId) {
      params = params.set('venteId', venteId);
    }
    return this.http.get<any>(this.url + 'vente' , {
      params,
    });
  }
}
