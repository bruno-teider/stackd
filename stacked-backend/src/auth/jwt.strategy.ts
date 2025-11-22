import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    console.log('🔑 JwtStrategy.validate - Payload recebido:', JSON.stringify(payload));
    
    // O payload contém 'sub' (userId), 'email', 'nome'
    const user = await this.authService.validateUser(payload.sub);
    
    if (!user) {
      console.log('❌ JwtStrategy.validate - Token inválido, usuário não encontrado');
      throw new UnauthorizedException('Token inválido');
    }
    
    console.log('✅ JwtStrategy.validate - Validação bem-sucedida para:', user.email);
    return user;
  }
}