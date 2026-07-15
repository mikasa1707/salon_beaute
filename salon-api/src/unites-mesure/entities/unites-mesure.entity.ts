import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('unites_mesure')
export class UniteMesure {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nom!: string;

  @Column({
    length: 10,
    unique: true,
  })
  symbole!: string;

  @Column({
    default: true,
  })
  actif!: boolean;
}
