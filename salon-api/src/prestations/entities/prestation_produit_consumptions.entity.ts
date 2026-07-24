import { Reservation } from 'src/reservations/entities/reservation.entity';
import { PrestationProduit } from 'src/prestations_produits/entities/prestations-produits.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity()
export class PrestationProduitConsumption {
  @PrimaryGeneratedColumn()
  id!: number;

  /**
   * La réservation où la prestation a été réalisée
   */
  @ManyToOne(() => Reservation, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  reservation!: Reservation;

  /**
   * Vente optionnelle
   * Une consommation peut exister avant paiement
   */
  @ManyToOne(() => Vente, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  vente?: Vente;

  /**
   * Produit utilisé dans la recette
   */
  @ManyToOne(() => PrestationProduit, {
    nullable: false,
  })
  produitPrestation!: PrestationProduit;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 3,
  })
  quantite!: number;

  @Column({
    type: 'enum',
    enum: ['CONSUME', 'RESTORE'],
  })
  action!: 'CONSUME' | 'RESTORE';

  @CreateDateColumn()
  created_at!: Date;
}
