import { CashMovement } from 'src/cash-movements/entities/cash-movement.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('cash_registers')
export class CashRegister {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  salonId!: number;

  /**
   * Fond de caisse ouverture
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  openingBalance!: number;

  /**
   * Total paiement espèces
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalCash!: number;

  /**
   * Total paiement carte
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalCard!: number;

  /**
   * Total Mobile Money
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  totalMobileMoney!: number;

  /**
   * Sorties manuelles
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  cashout!: number;

  /**
   * Montant compté physiquement à fermeture
   */
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  closingBalance!: number;

  @Column({
    type: 'enum',
    enum: ['OPEN', 'CLOSED'],
    default: 'OPEN',
  })
  status!: 'OPEN' | 'CLOSED';

  @CreateDateColumn()
  openedAt!: Date;

  @Column({
    nullable: true,
  })
  closedAt?: Date;

  @OneToMany(() => CashMovement, (movement) => movement.cashRegister)
  movements!: CashMovement[];
}
