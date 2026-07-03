import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('cash_registers')
export class CashRegister {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  salonId!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  openingBalance!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  closingBalance!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCash!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalCard!: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalMobileMoney!: number;

  @Column({ default: 'OPEN' })
  status!: 'OPEN' | 'CLOSED';

  @CreateDateColumn()
  openedAt!: Date;

  @Column({ nullable: true })
  closedAt?: Date;
}
