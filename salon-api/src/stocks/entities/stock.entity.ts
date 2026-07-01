import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Produit } from '../../produits/entities/produit.entity';

@Entity('stocks')
export class Stock {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Produit)
  @JoinColumn({ name: 'produit_id' })
  produit!: Produit;

  @Column({
    default: 0,
  })
  quantite!: number;
}
