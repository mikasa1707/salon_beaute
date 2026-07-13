import { Prestation } from "./prestation";

export interface Personnel {
    id: number;
    nom: string;
    prenom: string;
    telephone?: string;
    email?: string;
    role: string;
    couleurAgenda?: string;
    actif: boolean;

    prestations: Prestation[];
}

export interface PersonnelConflict {
    reservationId: number;
    client: string;
    debut: string;
    fin: string;
}


export interface AvailablePersonnel {
    id: number;
    nom: string;
    prenom: string;
    prestations: {
        id: number;
        nom: string;
        duree: number;
        prix: number;
    }[];
    disponible: boolean;
    conflicts: PersonnelConflict[];
}
