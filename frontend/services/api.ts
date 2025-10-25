const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  perfilInvestidor: string;
}

export interface LoginData {
  email: string;
  senha: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    nome: string;
    email: string;
    perfilInvestidor: string;
    carteira: {
      id: string;
      saldo: number;
    };
  };
}

export const authService = {
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erro ao cadastrar usuário");
    }

    return response.json();
  },

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Credenciais inválidas");
    }

    return response.json();
  },

  async getProfile(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar perfil");
    }

    return response.json();
  },

  async getUserInfo(token: string) {
    const response = await fetch(`${API_BASE_URL}/auth/user_info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao buscar informações do usuário");
    }

    return response.json();
  },

  async updatePerfilInvestidor(token: string, perfilInvestidor: string) {
    const response = await fetch(`${API_BASE_URL}/auth/perfil-investidor`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ perfilInvestidor }),
    });

    if (!response.ok) {
      throw new Error("Erro ao atualizar perfil de investidor");
    }

    return response.json();
  },
};
