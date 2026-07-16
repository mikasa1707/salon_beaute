import { Prestation } from 'src/prestations/entities/prestation.entity';
import { ProduitUnite } from 'src/produits/entities/produit_unites.entity';
import { Vente } from 'src/ventes/entities/vente.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

@Entity('vente_produits')
export class VenteProduit {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Vente, (vente) => vente.produits, {
    onDelete: 'CASCADE',
  })
  vente!: Vente;

  // Produit vendu (optionnel)
  @ManyToOne(() => ProduitUnite, {
    nullable: true,
  })
  @JoinColumn({
    name: 'produit_unite_id',
  })
  produitUnite?: ProduitUnite;

  // Prestation vendue (optionnel)
  @ManyToOne(() => Prestation, {
    nullable: true,
  })
  @JoinColumn({
    name: 'prestation_id',
  })
  prestation?: Prestation;

  // Snapshot affichage facture
  @Column()
  label!: string;

  @Column()
  quantite!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  prix_unitaire!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  total!: number;
}
