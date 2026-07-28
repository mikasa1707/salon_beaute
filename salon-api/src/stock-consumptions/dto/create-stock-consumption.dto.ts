export class CreateStockConsumptionDto {
  motif!: string;
  salonId?: number;
  items!: StockConsumptionItemDto[];
}

export class StockConsumptionItemDto {
  produitUniteId!: number;
  quantite!: number;
}
