import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { Vente } from '../../ventes/entities/vente.entity';

export enum ModePaiement {
  ESPECES = 'ESPECES',
  MVOLA = 'MVOLA',
  ORANGE_MONEY = 'ORANGE_MONEY',
  AIRTEL_MONEY = 'AIRTEL_MONEY',
  CARTE = 'CARTE',
  CHEQUE = 'CHEQUE',
}

@Entity('paiements')
export class Paiement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Vente, (vente) => vente.paiements, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'vente_id' })
  vente!: Vente;

  @Column({
    type: 'enum',
    enum: ModePaiement,
  })
  mode!: ModePaiement;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  montant!: number;

  @Column({
    nullable: true,
  })
  reference?: string;

  @CreateDateColumn()
  date_paiement!: Date;
}
