import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { StockConsumption } from './stock-consumption.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';


@Entity('stock_consumption_items')
export class StockConsumptionItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => StockConsumption, (c) => c.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'consumption_id',
  })
  consumption!: StockConsumption;

  @ManyToOne(() => ProduitUnite)
  @JoinColumn({
    name: 'produit_unite_id',
  })
  produitUnite!: ProduitUnite;

  @Column('decimal')
  quantite!: number;
}
