import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Client } from '../../clients/entities/client.entity';
import { Personnel } from '../../personnels/entities/personnel.entity';
import { Prestation } from '../../prestations/entities/prestation.entity';

@Entity('reservations')
export class Reservation {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Client)
  @JoinColumn({ name: 'client_id' })
  client!: Client;

  @ManyToOne(() => Personnel)
  @JoinColumn({ name: 'personnel_id' })
  personnel!: Personnel;

  @ManyToOne(() => Prestation)
  @JoinColumn({ name: 'prestation_id' })
  prestation!: Prestation;

  @Column({
    type: 'datetime',
  })
  date_debut!: Date;

  @Column({
    type: 'datetime',
  })
  date_fin!: Date;

  @Column({
    default: 'EN_ATTENTE',
  })
  statut!: string;
}
