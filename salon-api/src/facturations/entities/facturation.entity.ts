import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  CreateDateColumn,
  OneToOne,
  Unique,
  Index,
} from 'typeorm';

import { Client } from '../../clients/entities/client.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { FacturationItem } from './facturation-item.entity';
import { Vente } from 'src/ventes/entities/vente.entity';

export enum FacturationStatus {
  UNPAID = 'UNPAID',
  PROCESSING = 'PROCESSING', // 🔥 AJOUT PHASE 2
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED', // 🔥 AJOUT PHASE 2
}

@Entity('facturations')
@Unique('UQ_FACTURATION_RESERVATION', ['reservation'])
@Index('UQ_FACTURATION_PAYMENT_REF', ['paymentReference'], { unique: true })
export class Facturation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
    length: 20,
  })
  numero!: string;
  // ======================
  // RELATIONS
  // ======================

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client!: Client;

  /**
   * Une réservation = une facture (strict ERP rule)
   */
  @OneToOne(() => Reservation, { nullable: false })
  @JoinColumn({ name: 'reservation_id' })
  reservation!: Reservation;

  @OneToOne(() => Vente, (vente) => vente.facturation)
  vente?: Vente;

  // ======================
  // FINANCE
  // ======================

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total!: number;

  @Column({
    type: 'enum',
    enum: FacturationStatus,
    default: FacturationStatus.UNPAID,
  })
  status!: FacturationStatus;

  // ======================
  // ITEMS
  // ======================

  @OneToMany(() => FacturationItem, (item) => item.facturation, {
    cascade: true,
  })
  items!: FacturationItem[];

  // ======================
  // IDEMPOTENCE (PHASE 2)
  // ======================

  /**
   * Clé unique pour éviter double paiement / retry API
   */
  @Column({ nullable: true })
  paymentReference!: string;

  // ======================
  // LOCK MÉTIER (ERP SAFE)
  // ======================

  /**
   * Empêche double checkout même si bug concurrent
   */
  @Column({ default: false })
  isLocked!: boolean;

  /**
   * Protection supplémentaire (audit simple sans table log)
   */
  @Column({ nullable: true })
  processedAt?: Date;

  // ======================
  // AUDIT LIGHT (OPTION PRO)
  // ======================

  @Column({ nullable: true })
  failedReason?: string;

  // ======================
  // META
  // ======================

  @CreateDateColumn()
  created_at!: Date;
}
