import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Reservation } from '../../reservations/entities/reservation.entity';
import { VenteProduit } from '../../vente-produits/entities/vente-produit.entity';
import { Paiement } from '../../paiements/entities/paiement.entity';
import { Facturation } from 'src/facturations/entities/facturation.entity';
import { CashRegister } from 'src/cash-register/entities/cash_registers.entity';

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

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  montantPaye!: number;

  @OneToMany(() => VenteProduit, (vp) => vp.vente, {
    cascade: true,
  })
  produits!: VenteProduit[];

  @OneToMany(() => Paiement, (paiement) => paiement.vente, {
    cascade: true,
  })
  paiements!: Paiement[];

  @OneToOne(() => Facturation, {
    nullable: true,
  })
  @JoinColumn({
    name: 'facturation_id',
  })
  facturation!: Facturation;

  @Column({ default: false })
  isCancelled!: boolean;

  @Column({ nullable: true })
  cancelledAt?: Date;

  @ManyToOne(() => CashRegister)
  cashRegister!: CashRegister;

  @CreateDateColumn()
  created_at!: Date;
}
