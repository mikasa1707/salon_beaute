import { Role } from "./role";

export interface Utilisateur {

    id: number;

    nom: string;

    email: string;

    role: Role;

    actif: boolean;

}