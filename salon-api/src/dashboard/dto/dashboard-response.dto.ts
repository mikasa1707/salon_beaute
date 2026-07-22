export interface TopPersonnelDto {
  id: number;
  nom: string;
  prenom: string;
  total: number;
}

export interface TopProduitDto {
  id: number;
  nom: string;
  quantite: number;
  ca: number;
}

export interface TopPrestationDto {
  id: number;
  nom: string;
  total: number;
}

export interface CaEvolutionDto {
  date: string;
  total: number;
}

export interface DashboardResponseDto {
  kpi: {
    caJour: number;
    ventes: number;
    reservations: number;
    clients: number;
    panierMoyen: number;
  };

  caEvolution: CaEvolutionDto[];
  personnels: TopPersonnelDto[];
  prestations: TopPrestationDto[] | null;
  topProduit: TopProduitDto[] | null;

  stockAlerts: any[];
  mouvements: any[];

  caisse: {
    ouverte: boolean;
    solde: number;
  };

  currentReservations: any[];
  upcomingReservations: any[];
}
