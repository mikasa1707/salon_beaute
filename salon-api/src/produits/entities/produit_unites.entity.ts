import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { Produit } from './produit.entity';

@Entity('produit_unites')
export class ProduitUnite {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Produit, (p) => p.unites, {
    onDelete: 'CASCADE',
  })
  produit!: Produit;

  @Column()
  nom!: string; // 250ml, 1L, etc

  @Column({
    type: 'int',
    default: 0,
  })
  stock!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  prix!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  stock_minimum!: number;
}
