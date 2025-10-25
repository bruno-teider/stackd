# Sistema de Autenticação Stacked Backend

Este projeto implementa um sistema de autenticação com cadastro e login de usuários, incluindo criação automática de carteira.

## Estrutura das Tabelas

### Tabela Users
- `id` (UUID) - Chave primária
- `nome` (VARCHAR) - Nome do usuário
- `email` (VARCHAR) - Email único do usuário
- `senha` (VARCHAR) - Senha hasheada
- `perfilInvestidor` (VARCHAR) - Perfil de investidor do usuário
- `carteira` - Relacionamento 1:1 com Carteira

### Tabela Carteiras
- `id` (UUID) - Chave primária
- `saldo` (DECIMAL) - Saldo da carteira (padrão: 0)
- `user` - Relacionamento 1:1 com User

## Configuração

1. **Instalar dependências:**
```bash
npm install
```

2. **Configurar variáveis de ambiente:**
Copie o arquivo `.env.example` para `.env` e configure as variáveis:

```bash
# Configuração do Banco de Dados
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha
DB_NAME=stacked_db

# JWT Secret
JWT_SECRET=sua_chave_secreta_jwt_muito_segura

# Porta da aplicação
PORT=3000
```

3. **Configurar banco de dados MySQL:**
Certifique-se de que o MySQL esteja rodando e crie o banco de dados:
```sql
CREATE DATABASE stacked_db;
```

## Rotas Disponíveis

### POST /auth/register
Cadastra um novo usuário e cria automaticamente sua carteira.

**Corpo da requisição:**
```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123",
  "perfilInvestidor": "conservador"
}
```

**Resposta de sucesso:**
```json
{
  "user": {
    "id": "uuid-do-usuario",
    "nome": "João Silva",
    "email": "joao@example.com",
    "perfilInvestidor": "conservador",
    "carteira": {
      "id": "uuid-da-carteira",
      "saldo": 0
    }
  },
  "message": "Usuário criado com sucesso"
}
```

### POST /auth/login
Autentica um usuário existente.

**Corpo da requisição:**
```json
{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta de sucesso:**
```json
{
  "access_token": "jwt-token-aqui",
  "user": {
    "id": "uuid-do-usuario",
    "nome": "João Silva",
    "email": "joao@example.com",
    "perfilInvestidor": "conservador",
    "carteira": {
      "id": "uuid-da-carteira",
      "saldo": 0
    }
  }
}
```

### GET /auth/profile
Retorna o perfil do usuário autenticado (requer token JWT).

**Headers:**
```
Authorization: Bearer jwt-token-aqui
```

### GET /auth/user_info
Retorna informações completas e detalhadas do usuário autenticado (requer token JWT).

**Headers:**
```
Authorization: Bearer jwt-token-aqui
```

**Resposta de sucesso:**
```json
{
  "message": "Informações do usuário recuperadas com sucesso",
  "user": {
    "id": "uuid-do-usuario",
    "nome": "João Silva",
    "email": "joao@example.com",
    "perfilInvestidor": "conservador",
    "carteira": {
      "id": "uuid-da-carteira",
      "saldo": 0
    },
    "accountCreated": "Conta ativa",
    "hasWallet": true,
    "walletBalance": 0
  }
}
```

## Executar o Projeto

### Desenvolvimento
```bash
npm run start:dev
```

### Produção
```bash
npm run build
npm run start:prod
```

## Funcionalidades Implementadas

- ✅ Cadastro de usuários com validação
- ✅ Hash de senhas com bcrypt
- ✅ Login com JWT
- ✅ Criação automática de carteira ao cadastrar usuário
- ✅ Relacionamento 1:1 entre User e Carteira
- ✅ Validação de dados de entrada
- ✅ Middleware de autenticação JWT
- ✅ Rotas protegidas
- ✅ CORS habilitado

## Segurança

- Senhas são hasheadas usando bcrypt
- Tokens JWT com expiração de 24 horas
- Validação de entrada em todas as rotas
- Email único por usuário
- Middleware de autenticação para rotas protegidas