import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  action!: string;

  @Column()
  entity!: string;

  @Column()
  entityId!: number;

  @Column()
  userId!: number;

  @Column()
  username!: string;

  @Column({ type: 'json', nullable: true })
  payload!: Record<string, unknown>;

  @CreateDateColumn()
  createdAt!: Date;
}
