import { CashRegister } from './cash-register';

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

export interface CashMovement {
  id: number;
  cashRegister?: CashRegister;
  type: CashMovementType;
  direction: CashMovementDirection;
  amount: number;
  label?: string;
  reference?: string;
  createdAt: string;
}

export interface CreateCashMovement {
  type: CashMovementType;
  direction: CashMovementDirection;
  amount: number;
  label?: string;
  reference?: string;
}
