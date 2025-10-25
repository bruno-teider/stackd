import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Carteira } from '../entities/carteira.entity';
import { CreateUserDto, LoginDto } from '../dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Carteira)
    private carteiraRepository: Repository<Carteira>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto) {
    const { nome, email, senha, perfilInvestidor } = createUserDto;

    // Verificar se o usuário já existe
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('E-mail já está em uso');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Criar a carteira
    const carteira = this.carteiraRepository.create({
      saldo: 0,
    });
    await this.carteiraRepository.save(carteira);

    // Criar o usuário
    const user = this.userRepository.create({
      nome,
      email,
      senha: hashedPassword,
      perfilInvestidor,
      carteira,
    });

    await this.userRepository.save(user);

    // Retornar dados do usuário sem a senha
    const { senha: _, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      message: 'Usuário criado com sucesso',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, senha } = loginDto;

    // Buscar usuário com a carteira
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['carteira'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gerar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
    };

    const access_token = this.jwtService.sign(payload);

    // Retornar dados do usuário sem a senha
    const { senha: _, ...userWithoutPassword } = user;

    return {
      access_token,
      user: userWithoutPassword,
    };
  }

  async validateUser(userId: string): Promise<any> {
    console.log('🔍 AuthService.validateUser - Buscando userId:', userId);
    
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['carteira'],
    });

    console.log('👤 AuthService.validateUser - Usuário encontrado:', user ? 'SIM' : 'NÃO');
    
    if (user) {
      const { senha, ...result } = user;
      console.log('✅ AuthService.validateUser - Retornando dados do usuário');
      return result;
    }
    
    console.log('❌ AuthService.validateUser - Usuário não encontrado');
    return null;
  }

  async getUserInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['carteira'],
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Retornar todas as informações do usuário (sem a senha)
    const { senha, ...userInfo } = user;
    
    return {
      message: 'Informações do usuário recuperadas com sucesso',
      user: {
        ...userInfo,
        // Adicionar informações extras se necessário
        accountCreated: user.id ? 'Conta ativa' : 'Conta inativa',
        hasWallet: user.carteira ? true : false,
        walletBalance: user.carteira?.saldo || 0,
      }
    };
  }
}