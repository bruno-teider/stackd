import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  nome: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  senha: string;

  @IsNotEmpty()
  @IsString()
  perfilInvestidor: string;
}

export class LoginDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  senha: string;
}