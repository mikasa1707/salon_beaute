import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('prestations_recette')
export class Prestation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ProduitUnite, {
    onDelete: 'SET NULL',
  })
  @JoinColumn({ name: 'produit_unite_id' })
  unite!: ProduitUnite;

  @ManyToOne(() => Prestation, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'prestation_id' })
  prestation!: Prestation;

  @Column('decimal', {
    precision: 10,
    scale: 3,
  })
  quantite!: number;
}
