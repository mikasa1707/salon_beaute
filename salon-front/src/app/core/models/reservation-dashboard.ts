import { ReservationStatut } from "./reservation-statut.enum";

export interface ReservationDashboard {
  id: number;
  statut: ReservationStatut;
  date: string;
  heureDebut: string;
  heureFin: string;
  client: string;
  personnel: string;
  prestations: string[];
}
