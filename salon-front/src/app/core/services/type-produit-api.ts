import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environnements/environnement";
import { Marque } from "../models/marques";

@Injectable({
    providedIn: 'root'
})
export class TypeProduitApi {

    private api = environment.apiUrl + '/types-produits';

    constructor(private http: HttpClient) { }

    findAll(page = 1, limit = 10, search = '') {
        return this.http.get<any>(
            `${this.api}?page=${page}&limit=${limit}&search=${search}`
        );
    }

    findOne(id: number) {
        return this.http.get<Marque>(`${this.api}/${id}`);
    }

    create(dto: any) {
        return this.http.post<Marque>(this.api, dto);
    }

    update(id: number, dto: any) {
        return this.http.patch<Marque>(`${this.api}/${id}`, dto);
    }

    remove(id: number) {
        return this.http.delete(`${this.api}/${id}`);
    }

}