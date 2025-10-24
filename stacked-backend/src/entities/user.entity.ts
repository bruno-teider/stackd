import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Carteira } from './carteira.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  nome: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  senha: string;

  @Column({ type: 'varchar', length: 100 })
  perfilInvestidor: string;

  @OneToOne(() => Carteira, carteira => carteira.user, { cascade: true })
  @JoinColumn()
  carteira: Carteira;
}