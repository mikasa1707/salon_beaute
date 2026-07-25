import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';

import { CashRegister } from '../../cash-register/entities/cash_registers.entity';

export enum CashMovementType {
  OPENING = 'OPENING',

  SALE_CASH = 'SALE_CASH',
  SALE_CARD = 'SALE_CARD',
  SALE_MOBILE = 'SALE_MOBILE',

  OTHER_INCOME = 'OTHER_INCOME',

  CASH_OUT = 'CASH_OUT',
  EXPENSE = 'EXPENSE',
  REFUND = 'REFUND',
  SALARY_ADVANCE = 'SALARY_ADVANCE',
}

export enum CashMovementDirection {
  IN = 'IN',
  OUT = 'OUT',
}

@Entity('cash_movements')
export class CashMovement {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => CashRegister, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'cash_register_id',
  })
  cashRegister!: CashRegister;

  @Column({
    type: 'enum',
    enum: CashMovementType,
  })
  type!: CashMovementType;

  @Column({
    type: 'enum',
    enum: CashMovementDirection,
  })
  direction!: CashMovementDirection;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount!: number;

  @Column({
    nullable: true,
  })
  label?: string;

  @Column({
    nullable: true,
  })
  reference?: string;

  @CreateDateColumn()
  createdAt!: Date;
}
