import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToMany,
} from 'typeorm';
import { Prestation } from 'src/prestations/entities/prestation.entity';
import { ReservationPersonnel } from 'src/reservations/entities/reservation-personnel.entity';

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

  @Column({ length: 100, nullable: true })
  specialite!: string;

  // 🔐 login
  @Column({ unique: true })
  email!: string;

  @Column({ default: '123456' })
  password!: string;

  @Column({
    type: 'enum',
    enum: PersonnelRole,
    default: PersonnelRole.RECEPTION,
  })
  role!: PersonnelRole;

  @Column({ default: true })
  actif!: boolean;

  @Column({
    name: 'couleur_agenda',
    type: 'varchar',
    length: 7,
    default: '#0d6efd',
  })
  couleurAgenda!: string;

  @OneToMany(() => ReservationPersonnel, (rp) => rp.personnel)
  reservations!: ReservationPersonnel[];

  @ManyToMany(() => Prestation, (prestation) => prestation.personnels)
  prestations!: Prestation[];
}
