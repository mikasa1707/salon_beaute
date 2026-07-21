import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

@Entity('inventaires')
export class Inventaire {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    nullable: true,
  })
  numero?: string;

  @Column({ nullable: true })
  reference?: string;

  @Column({ nullable: true })
  note?: string;

  @Column({
    default: false,
  })
  valide!: boolean;

  @Column({
    default: true,
  })
  actif!: boolean;

  @OneToMany(() => InventaireLigne, (ligne) => ligne.inventaire, {
    cascade: true,
  })
  lignes!: InventaireLigne[];

  @CreateDateColumn()
  created_at!: Date;
}

@Entity('inventaire_lignes')
export class InventaireLigne {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Inventaire)
  inventaire!: Inventaire;

  @ManyToOne(() => ProduitUnite)
  produitUnite!: ProduitUnite;

  @Column('decimal', {
    precision: 10,
    scale: 3,
  })
  stockTheorique!: number;

  @Column('decimal', {
    precision: 10,
    scale: 3,
  })
  stockReel!: number;

  @Column('decimal', {
    precision: 10,
    scale: 3,
  })
  ecart!: number;
}
