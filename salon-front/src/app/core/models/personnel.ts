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
