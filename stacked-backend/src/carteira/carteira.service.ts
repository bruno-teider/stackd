import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carteira } from '../entities/carteira.entity';
import { Ativo } from '../entities/ativo.entity';
import { ComprarAtivoDto, VenderAtivoDto } from '../dto/carteira.dto';

@Injectable()
export class CarteiraService {
  constructor(
    @InjectRepository(Carteira)
    private carteiraRepository: Repository<Carteira>,
    @InjectRepository(Ativo)
    private ativoRepository: Repository<Ativo>,
  ) {}

  async comprarAtivo(userId: string, comprarAtivoDto: ComprarAtivoDto) {
    const { categoria, preco_compra, quantidade, dta_compra, ticker, outros_custos } = comprarAtivoDto as any;
    
    // Buscar carteira do usuário
    const carteira = await this.carteiraRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });

    if (!carteira) {
      throw new NotFoundException('Carteira não encontrada');
    }

  const custos = Number(outros_custos || 0);
    const valorTotal = Number(preco_compra) * Number(quantidade) + custos;

    // Verificação de saldo removida - permitir compra independente do saldo

    // Criar novo ativo
    const novoAtivo = this.ativoRepository.create({
      categoria,
      preco_compra,
      quantidade,
      valorTotal,
      carteira,
      ticker: ticker || null,
      dta_compra: dta_compra ? new Date(dta_compra) : new Date(),
    });    // Salvar ativo
    await this.ativoRepository.save(novoAtivo);

    // Atualizar saldo da carteira
    carteira.saldo = Number(carteira.saldo) - valorTotal;
    await this.carteiraRepository.save(carteira);

    return {
      message: 'Ativo comprado com sucesso',
      ativo: {
        id: novoAtivo.id,
        categoria: novoAtivo.categoria,
        preco_compra: novoAtivo.preco_compra,
        quantidade: novoAtivo.quantidade,
        valorTotal: novoAtivo.valorTotal,
        dta_compra: novoAtivo.dta_compra,
        ticker: novoAtivo.ticker
      },
      saldo_restante: carteira.saldo
    };
  }

  async venderAtivo(userId: string, venderAtivoDto: VenderAtivoDto) {
    const { ativoId, ticker, quantidade, preco_venda } = venderAtivoDto as any;

    // Buscar carteira do usuário
    const carteira = await this.carteiraRepository.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });

    if (!carteira) {
      throw new NotFoundException('Carteira não encontrada');
    }

    const valorVenda = preco_venda * quantidade;

    // Buscar ativo por id ou ticker (opcional - pode não existir)
    let ativo: Ativo | null = null;
    if (ativoId) {
      ativo = await this.ativoRepository.findOne({
        where: { id: ativoId },
        relations: ['carteira', 'carteira.user']
      });
    } else if (ticker) {
      ativo = await this.ativoRepository.findOne({
        where: { ticker },
        relations: ['carteira', 'carteira.user']
      });
    }

    // Se o ativo existir, atualizar/remover
    if (ativo) {
      // Verificar se o ativo pertence ao usuário
      if (ativo.carteira.user.id !== userId) {
        throw new BadRequestException('Este ativo não pertence a você');
      }

      // Se vender toda a quantidade, remover o ativo
      if (Number(ativo.quantidade) === quantidade) {
        await this.ativoRepository.remove(ativo);
      } else {
        // Atualizar quantidade e valor total do ativo
        ativo.quantidade = Number(ativo.quantidade) - quantidade;
        ativo.valorTotal = Number(ativo.quantidade) * Number(ativo.preco_compra);
        await this.ativoRepository.save(ativo);
      }
    }

    // Atualizar saldo da carteira (sempre, independente de ter o ativo ou não)
    carteira.saldo = Number(carteira.saldo) + valorVenda;
    await this.carteiraRepository.save(carteira);

    return {
      message: 'Ativo vendido com sucesso',
      venda: {
        categoria: ativo?.categoria || ticker || 'Desconhecido',
        quantidade_vendida: quantidade,
        preco_venda,
        valor_recebido: valorVenda
      },
      saldo_atual: carteira.saldo
    };
  }

  async obterCarteira(userId: string) {
    const carteira = await this.carteiraRepository.findOne({
      where: { user: { id: userId } },
      relations: ['ativos', 'user']
    });

    if (!carteira) {
      throw new NotFoundException('Carteira não encontrada');
    }

    // Calcular valor total dos ativos
    const valorTotalAtivos = carteira.ativos.reduce((total, ativo) => {
      return total + Number(ativo.valorTotal);
    }, 0);

    return {
      message: 'Carteira recuperada com sucesso',
      carteira: {
        id: carteira.id,
        saldo: carteira.saldo,
        valor_total_ativos: valorTotalAtivos,
        patrimonio_total: Number(carteira.saldo) + valorTotalAtivos,
        ativos: carteira.ativos.map(ativo => ({
          id: ativo.id,
          categoria: ativo.categoria,
          ticker: ativo.ticker,
          preco_compra: ativo.preco_compra,
          quantidade: ativo.quantidade,
          valorTotal: ativo.valorTotal,
          dta_compra: ativo.dta_compra
        }))
      }
    };
  }

  async adicionarSaldo(userId: string, valor: number) {
    const carteira = await this.carteiraRepository.findOne({
      where: { user: { id: userId } }
    });

    if (!carteira) {
      throw new NotFoundException('Carteira não encontrada');
    }

    carteira.saldo = Number(carteira.saldo) + valor;
    await this.carteiraRepository.save(carteira);

    return {
      message: 'Saldo adicionado com sucesso',
      saldo_atual: carteira.saldo
    };
  }
}