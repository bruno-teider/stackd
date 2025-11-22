import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../entities/user.entity';
import { Carteira } from '../entities/carteira.entity';
import { CreateUserDto, LoginDto, UpdatePerfilInvestidorDto } from '../dto/auth.dto';

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

    console.log('🔐 AuthService.login - Tentativa de login para email:', email);

    // Buscar usuário com a carteira
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['carteira'],
    });

    if (!user) {
      console.log('❌ AuthService.login - Usuário não encontrado para email:', email);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log('👤 AuthService.login - Usuário encontrado:', user.id, user.email);

    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      console.log('❌ AuthService.login - Senha inválida para usuário:', user.email);
      throw new UnauthorizedException('Credenciais inválidas');
    }

    console.log('✅ AuthService.login - Senha válida, gerando token para:', user.email);

    // Gerar token JWT
    const payload = {
      sub: user.id,
      email: user.email,
      nome: user.nome,
    };

    const access_token = this.jwtService.sign(payload);

    console.log('🎫 AuthService.login - Token gerado com sucesso para:', user.email);

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

  async updatePerfilInvestidor(userId: string, novoPerfilInvestidor: string) {
    // Buscar usuário
    const user = await this.userRepository.findOne({ where: { id: userId } });
    
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }

    // Atualizar perfil
    user.perfilInvestidor = novoPerfilInvestidor;
    await this.userRepository.save(user);

    // Retornar usuário atualizado sem senha
    const { senha, ...userUpdated } = user;
    
    return {
      message: 'Perfil de investidor atualizado com sucesso',
      user: userUpdated
    };
  }
}