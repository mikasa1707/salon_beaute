import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { StockConsumptionItem } from './stock-consumption-item.entity';

@Entity('stock_consumptions')
export class StockConsumption {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    unique: true,
  })
  numero!: string;

  @Column()
  salonId!: number;

  @Column({
    nullable: true,
  })
  motif?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @OneToMany(() => StockConsumptionItem, (item) => item.consumption, {
    cascade: true,
  })
  items!: StockConsumptionItem[];
}
