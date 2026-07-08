import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Produit } from '../../produits/entities/produit.entity';

@Entity('marques')
export class Marque {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nom!: string;

  @OneToMany(() => Produit, (produit) => produit.marque)
  produits!: Produit[];

  @Column({
    default: true
  })
  actif!: boolean;
}
