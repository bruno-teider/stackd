import { IsNotEmpty, IsString, IsNumber, IsPositive, Min, IsOptional } from 'class-validator';

export class ComprarAtivoDto {
  @IsNotEmpty()
  @IsString()
  categoria: string; // 'ACAO', 'FII', 'CRIPTO', etc.

  @IsNotEmpty()
  @IsString()
  ticker: string; // Ex: PETR4, BTC-USD

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Preço deve ser maior que zero' })
  preco_compra: number;

  @IsNotEmpty()
  @IsString()
  dta_compra: string; // ISO date string (yyyy-mm-dd)

  @IsNumber()
  @Min(0)
  outros_custos?: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Quantidade deve ser maior que zero' })
  quantidade: number;
}

export class VenderAtivoDto {
  // Pode enviar `ativoId` (uuid) ou `ticker` para identificar o ativo
  @IsOptional()
  @IsString()
  ativoId?: string;

  @IsOptional()
  @IsString()
  ticker?: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Quantidade deve ser maior que zero' })
  quantidade: number;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive({ message: 'Preço deve ser maior que zero' })
  preco_venda: number;
}