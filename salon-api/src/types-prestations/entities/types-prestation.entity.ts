import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Prestation } from '../../prestations/entities/prestation.entity';

@Entity('types_prestations')
export class TypePrestation {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  nom!: string;

  @Column({ default: true })
  actif!: boolean;

  @OneToMany(() => Prestation, (prestation) => prestation.typePrestation)
  prestations!: Prestation[];
}
