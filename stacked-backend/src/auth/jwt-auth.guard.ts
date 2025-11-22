import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;
    
    console.log('🔐 JwtAuthGuard - Authorization header:', authHeader ? 'Presente' : 'Ausente');
    if (authHeader) {
      console.log('🔐 JwtAuthGuard - Token preview:', authHeader.substring(0, 30) + '...');
    }
    
    return super.canActivate(context);
  }

  handleRequest(err: any, user: any, info: any) {
    if (err || !user) {
      console.log('❌ JwtAuthGuard - Erro na validação:', info?.message || err?.message || 'Usuário não encontrado');
      throw err || new UnauthorizedException();
    }
    return user;
  }
}