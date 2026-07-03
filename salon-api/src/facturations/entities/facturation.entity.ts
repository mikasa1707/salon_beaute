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
} from 'typeorm';

import { Client } from '../../clients/entities/client.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';
import { FacturationItem } from './facturation-item.entity';

export enum FacturationStatus {
  UNPAID = 'UNPAID',
  PARTIAL = 'PARTIAL',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

@Entity('facturations')
@Unique('UQ_FACTURATION_RESERVATION', ['reservation'])
export class Facturation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Client, { nullable: false })
  @JoinColumn({ name: 'client_id' })
  client!: Client;

  /**
   * Une réservation possède une seule facture.
   */
  @OneToOne(() => Reservation, { nullable: false })
  @JoinColumn({
    name: 'reservation_id',
  })
  reservation!: Reservation;

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

  @OneToMany(() => FacturationItem, (item) => item.facturation, {
    cascade: true,
  })
  items!: FacturationItem[];

  @Column({ nullable: true, unique: true })
  paymentReference!: string;

  @Column({ default: false })
  isLocked!: boolean;

  @CreateDateColumn()
  created_at!: Date;
}
