export class PrestationsRecette {}
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { Produit } from 'src/produits/entities/produit.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  JoinColumn,
} from 'typeorm';


@Entity('prestations_recettes')
export class PrestationRecette {

  @PrimaryGeneratedColumn()
  id!: number;


  @ManyToOne(
    () => Prestation,
    {
      onDelete: 'CASCADE'
    }
  )
  @JoinColumn({
    name: 'prestation_id'
  })
  prestation!: Prestation;


  @ManyToOne(
    () => Produit,
    {
      onDelete: 'RESTRICT'
    }
  )
  @JoinColumn({
    name: 'produit_id'
  })
  produit!: Produit;


  @Column('decimal', {
    precision: 10,
    scale: 3
  })
  quantite!: number;

}