import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Marque } from '../../marques/entities/marque.entity';
import { TypeProduit } from '../../types-produits/entities/types-produit.entity';
import { Stock } from '../../stocks/entities/stock.entity';

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

  @OneToOne(() => Stock, (stock) => stock.produit)
  stock!: Stock;
}
