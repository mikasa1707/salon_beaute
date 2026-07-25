import { Client } from './client';
import { FacturationItem } from './facturation-item';
import { Reservation } from './reservation';

export interface Facturation {
  id: number;
  numero: string;
  reservation: Reservation;
  client?: Client,
  total: number;
  statut: string;
  date: Date;
  nom: string;
  date_facture: string;
  genre: string;
  items: FacturationItem[];
}
