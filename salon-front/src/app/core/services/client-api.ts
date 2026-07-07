import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environnements/environnement';
import { Client } from '../models/client';


@Injectable({
    providedIn: 'root'
})
export class ClientService {

    private apiUrl = `${environment.apiUrl}/clients`;

    constructor(private http: HttpClient) { }

    findAll(page = 1, limit = 10, search = ''): Observable<any> {
        let params = new HttpParams().set('page', page).set('limit', limit);
        if (search.trim()) {
            params = params.set('search', search.trim());
        }
        return this.http.get<any>(this.apiUrl, { params });
    }

    findOne(id: number): Observable<Client> {
        return this.http.get<Client>(`${this.apiUrl}/${id}`);
    }

    create(client: Partial<Client>): Observable<Client> {
        return this.http.post<Client>(this.apiUrl, client);
    }

    update(id: number, client: Partial<Client>): Observable<Client> {
        return this.http.patch<Client>(
            `${this.apiUrl}/${id}`,
            client
        );
    }

    remove(id: number): Observable<void> {
        return this.http.delete<void>(
            `${this.apiUrl}/${id}`
        );
    }

}