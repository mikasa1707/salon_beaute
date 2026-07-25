export interface CashRegister {
  id: number;
  openingBalance: number;
  closingBalance: number;
  totalCash: number;
  totalCard: number;
  totalMobileMoney: number;
  cashout: number;
  theorique: number;
  totalPaiement: number;
  status: 'OPEN' | 'CLOSED' | 'FORCED';
  openedAt: Date;
  closedAt?: Date;
}
