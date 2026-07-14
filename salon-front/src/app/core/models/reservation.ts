import { Client } from "./client";
import { Personnel } from "./personnel";
import { Prestation } from "./prestation";

export interface Reservation {

  id: number;
  client: Client;
  personnel: Personnel;
  prestations: Prestation[];
  dateDebut: Date;
  dateFin: Date;
  totalPrix: number;
  totalDuree: number;
  statut: string;

}