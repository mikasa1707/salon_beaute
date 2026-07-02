import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Vente } from '../../ventes/entities/vente.entity';
import { Produit } from '../../produits/entities/produit.entity';

@Entity('vente_produits')
export class VenteProduit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Vente, (vente) => vente.produits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vente_id' })
  vente!: Vente;

  @ManyToOne(() => Produit)
  @JoinColumn({ name: 'produit_id' })
  produit!: Produit;

  @Column()
  quantite!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  prix_unitaire!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total!: number;
}
