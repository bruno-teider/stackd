import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Carteira } from './carteira.entity';

@Entity('ativos')
export class Ativo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  categoria: string; // Ex: 'ACAO', 'FII', 'CRIPTO'

  @Column('decimal', { precision: 10, scale: 2 })
  preco_compra: number;

  @CreateDateColumn()
  dta_compra: Date;

  @Column('decimal', { precision: 10, scale: 3 })
  quantidade: number;

  @Column('decimal', { precision: 15, scale: 2 })
  valorTotal: number; // quantidade * preco_compra

  @ManyToOne(() => Carteira, carteira => carteira.ativos)
  carteira: Carteira;
}