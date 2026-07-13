import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Reservation } from '../../reservations/entities/reservation.entity';

export enum ClientGenre {
  MADAME = 'Mme',
  MONSIEUR = 'Mr',
  MADEMOISELLE = 'Mlle',
}

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    nullable: true, length: 100
  })
  nom!: string;

  @Column({ length: 100 })
  prenom!: string;

  @Column({ length: 20 })
  telephone!: string;

  @Column({ nullable: true })
  email!: string;

  @Column({
    default: true
  })
  actif!: boolean;

  @OneToMany(() => Reservation, (reservation) => reservation.client)
  reservations!: Reservation[];

  @Column({
    type: 'enum',
    enum: ClientGenre,
    default: ClientGenre.MADAME,
  })
  genre!: ClientGenre;
}
