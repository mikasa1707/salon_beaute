import { ModePaiement } from 'src/paiements/entities/paiement.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';

export class CheckoutPosDto {
  ticketId!:string;
  factureId!:number;
  items!: {
    id: number;
    label: string;
    quantite: number;
    prix: number;
    produit?: ProduitUnite;
    prestation?: Prestation;
  }[];
  paiement!: {
    modePaiement: ModePaiement;
    montant: number;
    montantrecu?: number;
    montantrendu?: number;
    // monnaie?: number;
    referencePaiement?: string;
    numeroPaiement?: string;
  };
  remise!: number;
  total!: number;
}
