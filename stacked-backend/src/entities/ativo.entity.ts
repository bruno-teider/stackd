import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Carteira } from './carteira.entity';

@Entity('ativos')
export class Ativo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 10 })
  categoria: string; // Ex: 'ACAO', 'FII', 'CRIPTO'

  @Column('decimal', { precision: 10, scale: 2 })
  preco_compra: number;

  @Column({ type: 'date' })
  dta_compra: Date;

  // Especifica explicitamente o tipo SQL para evitar que o metadata do TypeScript
  // (que pode ser `Object` para tipos union) gere um tipo não suportado.
  @Column({ type: 'varchar', length: 16, nullable: true })
  ticker: string | null;

  @Column('decimal', { precision: 10, scale: 3 })
  quantidade: number;

  @Column('decimal', { precision: 15, scale: 2 })
  valorTotal: number; // quantidade * preco_compra

  @ManyToOne(() => Carteira, carteira => carteira.ativos)
  carteira: Carteira;
}