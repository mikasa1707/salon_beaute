import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Produit } from '../../produits/entities/produit.entity';

@Entity('inventaires')
export class Inventaire {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Produit)
  @JoinColumn({ name: 'produit_id' })
  produit!: Produit;

  @Column()
  quantite_theorique!: number;

  @Column()
  quantite_reelle!: number;

  @Column()
  ecart!: number;

  @CreateDateColumn()
  date_inventaire!: Date;
}
