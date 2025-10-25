import { Controller, Post, Body, ValidationPipe, UseGuards, Get, Request, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginDto, UpdatePerfilInvestidorDto } from '../dto/auth.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  async register(@Body(ValidationPipe) createUserDto: CreateUserDto) {
    return this.authService.register(createUserDto);
  }

  @Post('login')
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('user_info')
  async getUserInfo(@Request() req) {
    return this.authService.getUserInfo(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Put('perfil-investidor')
  async updatePerfilInvestidor(
    @Request() req, 
    @Body(ValidationPipe) updatePerfilDto: UpdatePerfilInvestidorDto
  ) {
    return this.authService.updatePerfilInvestidor(req.user.id, updatePerfilDto.perfilInvestidor);
  }
}