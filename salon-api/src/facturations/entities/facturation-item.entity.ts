import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';

import { Facturation } from './facturation.entity';
import { ProduitUnite } from '../../produits/entities/produit_unites.entity';
import { Prestation } from 'src/prestations/entities/prestation.entity';

@Entity('facturation_items')
export class FacturationItem {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Facturation, (f) => f.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'facturation_id' })
  facturation!: Facturation;

  // 🔥 lien vers unité produit (IMPORTANT)
  @ManyToOne(() => ProduitUnite, {
    nullable: true,
  })
  @JoinColumn({ name: 'produit_unite_id' })
  produitUnite?: ProduitUnite;

  @ManyToOne(() => Prestation, {
    nullable: true,
  })
  @JoinColumn({
    name: 'prestation_id',
  })
  prestation?: Prestation;

  @Column()
  quantite!: number;

  // snapshot prix au moment de la facture
  @Column({ type: 'decimal', precision: 10, scale: 2 })
  prix_unitaire!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  // optionnel (si tu veux traçabilité)
  @Column({ nullable: true })
  label?: string;
}
