# API de Autenticação - Exemplos de Uso# Exemplos de Teste das Rotas de Autenticação



Este documento contém exemplos práticos de como usar todas as rotas da API de autenticação.## 1. Cadastrar um novo usuário



## 🔧 Configuração```bash

curl -X POST http://localhost:3000/auth/register \

- **Base URL:** `http://localhost:3000`    -H "Content-Type: application/json" \

- **Autenticação:** Bearer Token (JWT)    -d '{

- **Content-Type:** `application/json`    "nome": "João Silva",

    "email": "joao@example.com",

---    "senha": "senha123456",

    "perfilInvestidor": "conservador"

## 📋 Rotas Disponíveis  }'

```

### 1. **POST** `/auth/register` - Cadastro de Usuário

**Resposta esperada:**

Cria um novo usuário e automaticamente cria uma carteira vinculada.```json

{

**Exemplo com cURL:**  "user": {

```bash    "id": "uuid-gerado",

curl -X POST http://localhost:3000/auth/register \    "nome": "João Silva",

  -H "Content-Type: application/json" \    "email": "joao@example.com",

  -d '{    "perfilInvestidor": "conservador",

    "nome": "João Silva",    "carteira": {

    "email": "joao@example.com",      "id": "uuid-da-carteira",

    "senha": "senha123456",      "saldo": 0

    "perfilInvestidor": "conservador"    }

  }'  },

```  "message": "Usuário criado com sucesso"

}

**Exemplo com PowerShell:**```

```powershell

$body = @{## 2. Fazer login

  nome = "João Silva"

  email = "joao@example.com"```bash

  senha = "senha123456"curl -X POST http://localhost:3000/auth/login \

  perfilInvestidor = "conservador"  -H "Content-Type: application/json" \

} | ConvertTo-Json  -d '{

    "email": "joao@example.com",

Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -Body $body -ContentType "application/json"    "senha": "senha123456"

```  }'

```

**Resposta esperada (201):**

```json**Resposta esperada:**

{```json

  "message": "Usuário criado com sucesso",{

  "user": {  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",

    "id": "19e8c4e2-55b4-4c44-8397-d5cd1f6304ce",  "user": {

    "nome": "João Silva",    "id": "uuid-do-usuario",

    "email": "joao@example.com",    "nome": "João Silva",

    "perfilInvestidor": "conservador",    "email": "joao@example.com",

    "carteira": {    "perfilInvestidor": "conservador",

      "id": "d494b9e9-e958-46d7-bcf8-ac247b39a0f8",    "carteira": {

      "saldo": "0.00"      "id": "uuid-da-carteira",

    }      "saldo": 0

  }    }

}  }

```}

```

---

## 3. Acessar perfil do usuário (rota protegida)

### 2. **POST** `/auth/login` - Login do Usuário

```bash

Autentica o usuário e retorna um token JWT.curl -X GET http://localhost:3000/auth/profile \

  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

**Exemplo com cURL:**```

```bash

curl -X POST http://localhost:3000/auth/login \**Resposta esperada:**

  -H "Content-Type: application/json" \```json

  -d '{{

    "email": "joao@example.com",  "id": "uuid-do-usuario",

    "senha": "senha123456"  "nome": "João Silva",

  }'  "email": "joao@example.com",

```  "perfilInvestidor": "conservador",

  "carteira": {

**Exemplo com PowerShell:**    "id": "uuid-da-carteira",

```powershell    "saldo": 0

$login = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body '{"email": "joao@example.com", "senha": "senha123456"}' -ContentType "application/json"  }

Write-Host "Token: $($login.access_token)"}

``````



**Resposta esperada (200):**## 4. Obter informações completas do usuário (user_info)

```json

{```bash

  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",curl -X GET http://localhost:3000/auth/user_info \

  "user": {  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

    "id": "19e8c4e2-55b4-4c44-8397-d5cd1f6304ce",```

    "nome": "João Silva",

    "email": "joao@example.com",**Resposta esperada:**

    "perfilInvestidor": "conservador",```json

    "carteira": {{

      "id": "d494b9e9-e958-46d7-bcf8-ac247b39a0f8",  "message": "Informações do usuário recuperadas com sucesso",

      "saldo": "0.00"  "user": {

    }    "id": "uuid-do-usuario",

  }    "nome": "João Silva",

}    "email": "joao@example.com",

```    "perfilInvestidor": "conservador",

    "carteira": {

---      "id": "uuid-da-carteira",

      "saldo": 0

### 3. **GET** `/auth/profile` - Perfil do Usuário    },

    "accountCreated": "Conta ativa",

Retorna o perfil básico do usuário autenticado.    "hasWallet": true,

    "walletBalance": 0

**⚠️ Requer Autenticação:** Bearer Token  }

}

**Exemplo com cURL:**```

```bash

curl -X GET http://localhost:3000/auth/profile \## Erros Comuns

  -H "Authorization: Bearer SEU_TOKEN_AQUI"

```### 1. Email já existe

```json

**Exemplo com PowerShell:**{

```powershell  "statusCode": 409,

$headers = @{"Authorization" = "Bearer $($login.access_token)"}  "message": "E-mail já está em uso",

$profile = Invoke-RestMethod -Uri "http://localhost:3000/auth/profile" -Method Get -Headers $headers  "error": "Conflict"

$profile | ConvertTo-Json}

``````



**Resposta esperada (200):**### 2. Credenciais inválidas

```json```json

{{

  "id": "19e8c4e2-55b4-4c44-8397-d5cd1f6304ce",  "statusCode": 401,

  "nome": "João Silva",  "message": "Credenciais inválidas",

  "email": "joao@example.com",  "error": "Unauthorized"

  "perfilInvestidor": "conservador",}

  "carteira": {```

    "id": "d494b9e9-e958-46d7-bcf8-ac247b39a0f8",

    "saldo": "0.00"### 3. Dados de entrada inválidos

  }```json

}{

```  "statusCode": 400,

  "message": [

---    "email must be an email",

    "senha must be longer than or equal to 6 characters"

### 4. **GET** `/auth/user_info` - Informações Completas do Usuário  ],

  "error": "Bad Request"

Retorna informações detalhadas do usuário com dados da carteira.}

```

**⚠️ Requer Autenticação:** Bearer Token

### 4. Token JWT inválido

**Exemplo com cURL:**```json

```bash{

curl -X GET http://localhost:3000/auth/user_info \  "statusCode": 401,

  -H "Authorization: Bearer SEU_TOKEN_AQUI"  "message": "Unauthorized"

```}

```
**Exemplo com PowerShell:**
```powershell
$headers = @{"Authorization" = "Bearer $($login.access_token)"}
$userInfo = Invoke-RestMethod -Uri "http://localhost:3000/auth/user_info" -Method Get -Headers $headers
$userInfo | ConvertTo-Json
```

**Resposta esperada (200):**
```json
{
  "message": "Informações do usuário recuperadas com sucesso",
  "user": {
    "id": "19e8c4e2-55b4-4c44-8397-d5cd1f6304ce",
    "nome": "João Silva",
    "email": "joao@example.com",
    "perfilInvestidor": "conservador",
    "carteira": {
      "id": "d494b9e9-e958-46d7-bcf8-ac247b39a0f8",
      "saldo": "0.00"
    },
    "accountCreated": "Conta ativa",
    "hasWallet": true,
    "walletBalance": "0.00"
  }
}
```

---

## 🔄 Fluxo Completo de Teste

### PowerShell - Teste Completo:
```powershell
# 1. Cadastrar usuário
Write-Host "=== 1. CADASTRANDO USUÁRIO ==="
$register = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" -Method Post -Body '{"nome": "Teste User", "email": "teste@email.com", "senha": "teste123", "perfilInvestidor": "conservador"}' -ContentType "application/json"
Write-Host "✅ Usuário cadastrado: $($register.user.nome)"

# 2. Fazer login
Write-Host "=== 2. FAZENDO LOGIN ==="
$login = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method Post -Body '{"email": "teste@email.com", "senha": "teste123"}' -ContentType "application/json"
Write-Host "✅ Login realizado - Token obtido"

# 3. Testar rotas autenticadas
$headers = @{"Authorization" = "Bearer $($login.access_token)"}

Write-Host "=== 3. TESTANDO PROFILE ==="
$profile = Invoke-RestMethod -Uri "http://localhost:3000/auth/profile" -Method Get -Headers $headers
Write-Host "✅ Profile OK - ID: $($profile.id)"

Write-Host "=== 4. TESTANDO USER_INFO ==="
$userInfo = Invoke-RestMethod -Uri "http://localhost:3000/auth/user_info" -Method Get -Headers $headers
Write-Host "✅ UserInfo OK - Saldo: $($userInfo.user.walletBalance)"

Write-Host "🎉 TODOS OS TESTES CONCLUÍDOS COM SUCESSO!"
```

---

## 🚨 Códigos de Erro

### Erros Comuns:

**400 - Bad Request:**
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

**401 - Unauthorized:**
```json
{
  "statusCode": 401,
  "message": "Credenciais inválidas",
  "error": "Unauthorized"
}
```

**409 - Conflict:**
```json
{
  "statusCode": 409,
  "message": "E-mail já está em uso",
  "error": "Conflict"
}
```

---

## 📊 Estrutura do Banco de Dados

### Tabela `users`:
```sql
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  nome VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  senha VARCHAR(255) NOT NULL,
  perfilInvestidor ENUM('conservador', 'moderado', 'arrojado') NOT NULL
);
```

### Tabela `carteiras`:
```sql
CREATE TABLE carteiras (
  id VARCHAR(36) PRIMARY KEY,
  saldo DECIMAL(10,2) DEFAULT 0.00,
  userId VARCHAR(36) UNIQUE,
  FOREIGN KEY (userId) REFERENCES users(id)
);
```

---

## 🔐 Configuração JWT

- **Algoritmo:** HS256  
- **Expiração:** 24 horas  
- **Payload:** `{ sub: userId, email: userEmail, nome: userName }`  
- **Header:** `Authorization: Bearer {token}`

---

**📝 Nota:** Substitua `SEU_TOKEN_AQUI` pelo token JWT real obtido no login.