import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environnements/environnement";
import { ProduitUnite } from "../models/produit-unite";

@Injectable({
    providedIn: 'root'
})
export class ProduitUniteApi {

    private api = environment.apiUrl + '/produit-unite';

    constructor(private http: HttpClient) { }

    findAll() {
        return this.http.get<any[]>(`${this.api}/unites`);
    }

    findbyProduit(produitId: number, page = 1, limit = 10, search = '') {
        return this.http.get<any>(`${this.api}/${produitId}/unites`,
            {
                params: { page, limit, search }
            }
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

    findUnites() {
        return this.http.get<any[]>(`${this.api}/unites`);
    }

}