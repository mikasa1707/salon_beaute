import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produit } from '../../produits/entities/produit.entity';

@Entity('types_produits')
export class TypeProduit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nom!: string;

  @OneToMany(() => Produit, (produit) => produit.typeProduit)
  produits!: Produit[];
}
