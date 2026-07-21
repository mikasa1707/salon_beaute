export interface DashboardResponse {
  kpi: {
    caJour: number;
    ventes: number;
    reservations: number;
    clients: number;
    panierMoyen: number;
  };

  caEvolution: {
    date: string;
    total: number;
  }[];

  prestations: {
    nom: string;
    total: number;
  }[];

  personnels: {
    nom: string;
    ca: number;
  }[];

  stockAlerts: {
    id: number;
    produit: string;
    unite: string;
    stock: number;
    minimum: number;
  }[];

  mouvements: any[];

  caisse: {
    ouverte: boolean;
    solde: number;
  };
}
