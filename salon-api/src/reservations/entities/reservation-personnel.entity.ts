import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

import { Reservation } from './reservation.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';

@Entity('reservation_personnels')
export class ReservationPersonnel {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Reservation, (reservation) => reservation.personnels, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'reservation_id',
  })
  reservation!: Reservation;

  @ManyToOne(() => Personnel, (personnel) => personnel.reservations, {
    eager: false,
  })
  @JoinColumn({
    name: 'personnel_id',
  })
  personnel!: Personnel;
}
