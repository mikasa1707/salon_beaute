import { Reservation } from "./reservation";

export interface Facturation {

    id: number;

    numero: string;

    reservation: Reservation;

    total: number;

    statut: string;

    date: Date;

}