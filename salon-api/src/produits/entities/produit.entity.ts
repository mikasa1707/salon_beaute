import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Marque } from '../../marques/entities/marque.entity';
import { TypeProduit } from '../../types-produits/entities/types-produit.entity';
import { ProduitUnite } from './produit_unites.entity';

@Entity('produits')
export class Produit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  prix_achat!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  prix_vente!: number;

  @ManyToOne(() => Marque)
  @JoinColumn({ name: 'marque_id' })
  marque!: Marque;

  @ManyToOne(() => TypeProduit)
  @JoinColumn({ name: 'type_produit_id' })
  typeProduit!: TypeProduit;

  @Column({
    type: 'int',
    default: 0,
  })
  stock_minimum!: number;

  @OneToMany(() => ProduitUnite, (u) => u.produit)
  unites!: ProduitUnite[];

  @Column({
    default: true,
  })
  actif!: boolean;
}
