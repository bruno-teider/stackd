import { IsNotEmpty, IsString, IsNumber, IsPositive, Min } from 'class-validator';

export class ComprarAtivoDto {
  @IsNotEmpty()
  @IsString()
  categoria: string; // 'ACAO', 'FII', 'CRIPTO', etc.

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Preço deve ser maior que zero' })
  preco_compra: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Quantidade deve ser maior que zero' })
  quantidade: number;
}

export class VenderAtivoDto {
  @IsNotEmpty()
  @IsString()
  ativoId: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Quantidade deve ser maior que zero' })
  quantidade: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Preço deve ser maior que zero' })
  preco_venda: number;
}