import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environnements/environnement';
import { Reservation } from '../models/reservation';
import { ReservationStatut } from '../models/reservation-statut.enum';

@Injectable({
  providedIn: 'root',
})
export class ReservationApi {
  private readonly api = `${environment.apiUrl}/reservations`;

  constructor(private http: HttpClient) { }

  create(data: any): Observable<Reservation> {
    return this.http.post<Reservation>(`${this.api}`, data);
  }

  findAll(): Observable<Reservation[]> {
    return this.http.get<Reservation[]>(this.api);
  }

  findOne(id: number): Observable<Reservation> {
    return this.http.get<Reservation>(`${this.api}/${id}`);
  }

  update(id: number, data: any): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.api}/${id}`, data);
  }

  delete(id: number) {
    return this.http.delete(`${this.api}/${id}`);
  }

  changeStatus(
    id: number,
    newStatus: ReservationStatut,
    products: {
      prestationProduitId: number;
      quantite: number;
    }[] = [],
  ): Observable<Reservation> {
    return this.http.patch<Reservation>(`${this.api}/${id}/status`, {
      status: newStatus,
      products,
    });
  }
}
