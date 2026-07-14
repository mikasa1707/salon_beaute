import { Prestation } from 'src/prestations/entities/prestation.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';
import { Produit } from '../../produits/entities/produit.entity';
import { ProduitUnite } from '../../produits/entities/produit_unites.entity';

@Entity('prestation_produits')
export class PrestationProduit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Prestation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prestation_id' })
  prestation!: Prestation;

  @ManyToOne(() => Produit, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'produit_id' })
  produit!: Produit;

  @ManyToOne(() => ProduitUnite, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'produit_unite_id' })
  unite!: ProduitUnite;

  @Column('decimal', {
    precision: 10,
    scale: 3,
  })
  quantite!: number;
}
