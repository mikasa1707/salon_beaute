export interface Checkout {
  ticketId: string;
  clientId?: number;
  reservationId?: number;
  factureId?: number;
  modePaiement: string;
  montantRecu: number;
  remise: number;
}
