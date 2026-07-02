import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Reservation } from '../../reservations/entities/reservation.entity';
import { VenteProduit } from '../../vente-produits/entities/vente-produit.entity';
import { Paiement } from '../../paiements/entities/paiement.entity';

@Entity('ventes')
export class Vente {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Reservation, {
    nullable: true,
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation?: Reservation;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total_prestations!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total_produits!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  remise!: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total!: number;

  @OneToMany(() => VenteProduit, (vp) => vp.vente, {
    cascade: true,
  })
  produits!: VenteProduit[];

  @OneToMany(() => Paiement, (paiement) => paiement.vente, {
    cascade: true,
  })
  paiements!: Paiement[];

  @CreateDateColumn()
  created_at!: Date;
}
