# Exemplos de Teste das Rotas de Autenticação

## 1. Cadastrar um novo usuário

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123456",
    "perfilInvestidor": "conservador"
  }'
```

**Resposta esperada:**
```json
{
  "user": {
    "id": "uuid-gerado",
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

## 2. Fazer login

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123456"
  }'
```

**Resposta esperada:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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

## 3. Acessar perfil do usuário (rota protegida)

```bash
curl -X GET http://localhost:3000/auth/profile \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Resposta esperada:**
```json
{
  "id": "uuid-do-usuario",
  "nome": "João Silva",
  "email": "joao@example.com",
  "perfilInvestidor": "conservador",
  "carteira": {
    "id": "uuid-da-carteira",
    "saldo": 0
  }
}
```

## Erros Comuns

### 1. Email já existe
```json
{
  "statusCode": 409,
  "message": "E-mail já está em uso",
  "error": "Conflict"
}
```

### 2. Credenciais inválidas
```json
{
  "statusCode": 401,
  "message": "Credenciais inválidas",
  "error": "Unauthorized"
}
```

### 3. Dados de entrada inválidos
```json
{
  "statusCode": 400,
  "message": [
    "email must be an email",
    "senha must be longer than or equal to 6 characters"
  ],
  "error": "Bad Request"
}
```

### 4. Token JWT inválido
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```