import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { Reservation } from '../../reservations/entities/reservation.entity';
import { Prestation } from '../../prestations/entities/prestation.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';

@Entity('reservation_prestations')
export class ReservationPrestation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.prestations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'reservation_id' })
  reservation!: Reservation;

  @ManyToOne(() => Prestation)
  @JoinColumn({ name: 'prestation_id' })
  prestation!: Prestation;

  @ManyToOne(() => Personnel)
  @JoinColumn({ name: 'personnel_id' })
  personnel!: Personnel;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  prix!: number;

  @Column()
  duree!: number;

  @Column({
    default: 1,
  })
  quantite!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  remarque?: string;
}
