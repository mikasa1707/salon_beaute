import { Personnel } from './personnel';

export interface Prestation {
  id: number;
  nom: string;
  description?: string;
  duree: number;
  prix: number;
  actif: boolean;

  personnels?: Personnel[];
  typePrestation: TypePrestation;
}

export interface TypePrestation {
  id: number;
  nom: string;
  actif: boolean;
}
