import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 100 })
  nom!: string;

  @Column({ length: 100 })
  prenom!: string;

  @Column({ length: 20 })
  telephone!: string;

  @Column({ nullable: true })
  email!: string;

  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations!: Reservation[];

  @Column({ nullable: true })
  salonId!: number;
}
