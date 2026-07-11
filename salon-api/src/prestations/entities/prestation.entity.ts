import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';

import { TypePrestation } from '../../types-prestations/entities/types-prestation.entity';
import { Personnel } from 'src/personnels/entities/personnel.entity';
import { ReservationPrestation } from 'src/reservations/entities/reservation-prestation.entity';

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

  @Column({ default: true })
  actif!: boolean;

  @Column({ nullable: true })
  typePrestationId!: number;

  @ManyToOne(() => TypePrestation)
  @JoinColumn({ name: 'typePrestationId' })
  typePrestation!: TypePrestation;

  @OneToMany(
    () => ReservationPrestation,
    (reservationPrestation) => reservationPrestation.prestation,
  )
  reservationPrestations!: ReservationPrestation[];

  @ManyToMany(() => Personnel, (personnel) => personnel.prestations)
  @JoinTable({
    name: 'prestation_personnel',
    joinColumn: {
      name: 'prestation_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'personnel_id',
      referencedColumnName: 'id',
    },
  })
  personnels!: Personnel[];
}
