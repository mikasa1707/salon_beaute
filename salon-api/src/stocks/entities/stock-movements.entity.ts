import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { ProduitUnite } from '../../produits/entities/produit_unites.entity';
import { Facturation } from 'src/facturations/entities/facturation.entity';
import { Vente } from 'src/ventes/entities/vente.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';

export enum StockMovementType {
  IN = 'IN',
  OUT = 'OUT',
  ADJUST = 'ADJUST', 
  TRANSFERT = 'TRANSFERT',
}

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProduitUnite, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'produit_unite_id',
  })
  produitUnite!: ProduitUnite;

  @Column({
    type: 'enum',
    enum: StockMovementType,
  })
  type!: StockMovementType;

  /**
   * Quantité positive
   * Le type indique entrée/sortie
   */
  @Column('decimal', {
    precision: 10,
    scale: 3,
  })
  quantite!: number;

  /**
   * Exemple:
   * RES-2026-000029
   */
  @Column({
    nullable: true,
  })
  reference?: string;

  @Column({
    nullable: true,
  })
  note?: string;

  @CreateDateColumn()
  created_at!: Date;

  @ManyToOne(() => Vente, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'vente_id',
  })
  vente?: Vente;

  @ManyToOne(() => Facturation, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  @JoinColumn({
    name: 'facture_id',
  })
  facture?: Facturation;

  @ManyToOne(() => Personnel, {
    nullable: true,
  })
  @JoinColumn({
    name: 'personnel_id',
  })
  personnel?: Personnel;
}
