import { CashMovement } from "./cash-movement";

export interface CashReport {
  session: {
    id: number;
    status: 'OPEN' | 'CLOSED' | 'FORCED';

    openedAt: string;

    closedAt: string;

    openingBalance: number;

    closingBalance: number;
  };

  resume: {
    fondInitial: number;

    soldeTheorique: number;

    soldeReel: number;

    ecart: number;

    totalVentes: number;

    montantVentes: number;
  };

  kpi: {
    espece: {
      montant: number;
      transactions: number;
    };

    mobile: {
      montant: number;
      transactions: number;
    };

    carte: {
      montant: number;
      transactions: number;
    };

    entree: {
      montant: number;
    };

    sortie: {
      montant: number;
    };
  };

  mouvements: CashMovement[];
}
