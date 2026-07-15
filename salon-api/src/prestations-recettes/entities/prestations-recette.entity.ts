import { Prestation } from 'src/prestations/entities/prestation.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import { UniteMesure } from 'src/unites-mesure/entities/unites-mesure.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
  Index,
} from 'typeorm';

@Entity('prestations_recettes')
@Index(['prestation', 'produit'], {
  unique: true,
})
export class PrestationRecette {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Prestation, (prestation) => prestation.recettes, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'prestation_id',
  })
  prestation!: Prestation;

  @ManyToOne(() => Produit, (produit) => produit.recettes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({
    name: 'produit_id',
  })
  produit!: Produit;

  @ManyToOne(() => UniteMesure)
  @JoinColumn({
    name: 'unite_mesure_id',
  })
  uniteMesure!: UniteMesure;

  /**
   * Quantité consommée dans la recette
   * Exemple :
   * shampoing : 50 ml
   * coloration : 1 unité
   */
  @Column('decimal', {
    precision: 10,
    scale: 3,
  })
  quantite!: number;
}
