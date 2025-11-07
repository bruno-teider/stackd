import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarteiraController } from './carteira.controller';
import { CarteiraService } from './carteira.service';
import { Carteira } from '../entities/carteira.entity';
import { Ativo } from '../entities/ativo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Carteira, Ativo])],
  controllers: [CarteiraController],
  providers: [CarteiraService],
  exports: [CarteiraService],
})
export class CarteiraModule {}