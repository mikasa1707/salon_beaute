import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from "typeorm";
import { Produit } from "./produit.entity";

@Entity('produit_unites')
export class ProduitUnite {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Produit, p => p.unites, {
    onDelete: 'CASCADE'
  })
  produit!: Produit;

  @Column()
  nom!: string;

  @Column({
    length: 20,
    default: ''
  })
  code!: string;

  @Column({
    default: 0
  })
  stock!: number;

  @Column({
    default: 0
  })
  stock_minimum!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2
  })
  prix!: number;

  @Column({
    default: true
  })
  actif!: boolean;

}