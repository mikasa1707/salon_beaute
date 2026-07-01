import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum PersonnelRole {
  ADMIN = 'ADMIN',
  RESPONSABLE = 'RESPONSABLE',
  COIFFEUR = 'COIFFEUR',
  ESTHETICIEN = 'ESTHETICIEN',
  RECEPTION = 'RECEPTION',
}

@Entity('personnels')
export class Personnel {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nom!: string;

  @Column({ length: 100 })
  prenom!: string;

  @Column({ length: 20 })
  telephone!: string;

  @Column({ length: 100 })
  specialite!: string;

  // 🔐 login
  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({
    type: 'enum',
    enum: PersonnelRole,
    default: PersonnelRole.RECEPTION,
  })
  role!: PersonnelRole;

  @Column({ default: true })
  actif!: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.personnel)
  reservations!: Reservation[];
}
