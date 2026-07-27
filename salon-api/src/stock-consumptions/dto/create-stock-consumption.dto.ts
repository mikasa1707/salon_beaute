export class CreateStockConsumptionDto {
  salonId!: number;
  motif?: string;
  items!: {
    produitUniteId: number;
    quantite: number;
  }[];
}
