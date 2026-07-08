import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environnements/environnement";
import { ProduitUnite } from "../models/produit-unite";

@Injectable({
    providedIn: 'root'
})
export class ProduitUniteApi {

    private api = environment.apiUrl + '/produits';

    constructor(private http: HttpClient) { }

    findAll(page = 1, limit = 10, search = '') {
        return this.http.get<any>(
            `${this.api}?page=${page}&limit=${limit}&search=${search}`
        );
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

}