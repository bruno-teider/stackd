import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { User } from './user.entity';

@Entity('carteiras')
export class Carteira {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  saldo: number;

  @OneToOne(() => User, user => user.carteira)
  user: User;
}