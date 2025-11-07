import { Controller, Post, Get, Body, Request, UseGuards, ValidationPipe, Put } from '@nestjs/common';
import { CarteiraService } from './carteira.service';
import { ComprarAtivoDto, VenderAtivoDto } from '../dto/carteira.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('carteira')
@UseGuards(JwtAuthGuard)
export class CarteiraController {
  constructor(private carteiraService: CarteiraService) {}

  @Get()
  async obterCarteira(@Request() req) {
    return this.carteiraService.obterCarteira(req.user.id);
  }

  @Post('comprar')
  async comprarAtivo(
    @Request() req,
    @Body(ValidationPipe) comprarAtivoDto: ComprarAtivoDto
  ) {
    return this.carteiraService.comprarAtivo(req.user.id, comprarAtivoDto);
  }

  @Post('vender')
  async venderAtivo(
    @Request() req,
    @Body(ValidationPipe) venderAtivoDto: VenderAtivoDto
  ) {
    return this.carteiraService.venderAtivo(req.user.id, venderAtivoDto);
  }

  @Put('adicionar-saldo')
  async adicionarSaldo(
    @Request() req,
    @Body('valor') valor: number
  ) {
    return this.carteiraService.adicionarSaldo(req.user.id, valor);
  }
}