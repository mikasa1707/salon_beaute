import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

import { TypePrestation } from '../../types-prestations/entities/types-prestation.entity';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('prestations')
export class Prestation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column()
  duree!: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  prix!: number;

  @ManyToOne(() => TypePrestation)
  @JoinColumn({ name: 'type_prestation_id' })
  typePrestation!: TypePrestation;

  @OneToMany(() => Reservation, (reservation) => reservation.prestation)
  reservations!: Reservation[];
}
