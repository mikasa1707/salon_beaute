import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Client } from '../../clients/entities/client.entity';
import { Personnel } from '../../personnels/entities/personnel.entity';
import { ReservationPrestation } from './reservation-prestation.entity';

export enum ReservationOrigine {
  RENDEZ_VOUS = 'RENDEZ_VOUS',
  SANS_RDV = 'SANS_RDV',
  TELEPHONE = 'TELEPHONE',
  EN_LIGNE = 'EN_LIGNE',
}

export enum ReservationStatut {
  EN_ATTENTE = 'EN_ATTENTE',
  CONFIRMEE = 'CONFIRMEE',
  ARRIVEE = 'ARRIVEE',
  EN_COURS = 'EN_COURS',
  TERMINEE = 'TERMINEE',
  ANNULEE = 'ANNULEE',
  ABSENT = 'ABSENT',
}

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  numero!: string;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client!: Client;

  @ManyToOne(() => Personnel)
  @JoinColumn({ name: 'personnel_id' })
  personnel!: Personnel;

  @Column({
    type: 'datetime',
  })
  date_debut!: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  date_debut_reelle?: Date;

  @Column({
    type: 'datetime',
  })
  date_fin_prevue!: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  date_fin_reelle?: Date;

  @Column({
    type: 'datetime',
    nullable: true,
  })
  date_arrivee?: Date;

  @Column({
    type: 'enum',
    enum: ReservationOrigine,
    default: ReservationOrigine.RENDEZ_VOUS,
  })
  origine!: ReservationOrigine;

  @Column({
    type: 'enum',
    enum: ReservationStatut,
    default: ReservationStatut.EN_ATTENTE,
  })
  statut!: ReservationStatut;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  total_prix!: number;

  @Column({
    default: 0,
  })
  total_duree!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  notes?: string;

  @OneToMany(
    () => ReservationPrestation,
    (reservationPrestation) => reservationPrestation.reservation,
    {
      cascade: true,
    },
  )
  prestations!: ReservationPrestation[];

  @CreateDateColumn()
  created_at!: Date;

  @UpdateDateColumn()
  updated_at!: Date;
}
