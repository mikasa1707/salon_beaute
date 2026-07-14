import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environnements/environnement";

@Injectable({
    providedIn: 'root',
})
export class PrestationProduitApi {
    private api = `${environment.apiUrl}/prestations-produits`;

    constructor(private http: HttpClient) { }

    findAll() {
        return this.http.get<any[]>(
            this.api
        );
    }

    transfer(data: any) {
        return this.http.post(
            `${this.api}/transfer`,
            data
        );
    }
}