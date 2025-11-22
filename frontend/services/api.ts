const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

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

export interface ComprarAtivoData {
  categoria: string;
  ticker: string;
  preco_compra: number;
  quantidade: number;
  dta_compra: string;
  outros_custos?: number;
}

export interface VenderAtivoData {
  ticker?: string;
  ativoId?: string;
  quantidade: number;
  preco_venda: number;
}

export interface Ativo {
  id: string;
  categoria: string;
  ticker: string | null;
  preco_compra: number;
  quantidade: number;
  valorTotal: number;
  dta_compra: string;
}

export interface CarteiraResponse {
  message: string;
  carteira: {
    id: string;
    saldo: number;
    valor_total_ativos: number;
    patrimonio_total: number;
    ativos: Ativo[];
  };
}

export interface CompraVendaResponse {
  message: string;
  saldo_restante?: number;
  saldo_atual?: number;
  ativo?: Ativo;
  venda?: {
    categoria: string;
    quantidade_vendida: number;
    preco_venda: number;
    valor_recebido: number;
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

export const carteiraService = {
  async obterCarteira(token: string): Promise<CarteiraResponse> {
    const response = await fetch(`${API_BASE_URL}/carteira`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || "Erro ao buscar carteira");
    }

    return response.json();
  },

  async comprarAtivo(token: string, data: ComprarAtivoData): Promise<CompraVendaResponse> {
    const response = await fetch(`${API_BASE_URL}/carteira/comprar`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || "Erro ao comprar ativo");
    }

    return response.json();
  },

  async venderAtivo(token: string, data: VenderAtivoData): Promise<CompraVendaResponse> {
    const response = await fetch(`${API_BASE_URL}/carteira/vender`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || "Erro ao vender ativo");
    }

    return response.json();
  },

  async adicionarSaldo(token: string, valor: number) {
    const response = await fetch(`${API_BASE_URL}/carteira/adicionar-saldo`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ valor }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || error.error || "Erro ao adicionar saldo");
    }

    return response.json();
  },
};
