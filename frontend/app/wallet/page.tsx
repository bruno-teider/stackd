"use client";

import { useState, useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Header } from "../components/Header";
import Link from "next/link";
import { carteiraService } from "../../services/api";

interface Ativo {
  id: number;
  ticker: string;
  tipo_ativo: string;
  quantidade: number;
  preco_compra: number;
  dta_compra: string;
  outros_custos: number;
}

interface CarteiraData {
  id: number;
  saldo: number;
  ativos: Ativo[];
}

interface Action {
  id: string;
  type: "income" | "expense" | "transfer";
  description: string;
  amount: number;
  category: string;
  timestamp: Date;
  status: "completed" | "pending" | "failed";
}

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function WalletPage() {
  const [carteira, setCarteira] = useState<CarteiraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar dados da carteira
  useEffect(() => {
    const fetchCarteira = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token") || localStorage.getItem("token");
        
        if (!token) {
          window.location.href = "/register";
          return;
        }

        const response = await carteiraService.obterCarteira(token);
        
        setCarteira({
          id: parseInt(response.carteira.id),
          saldo: response.carteira.saldo,
          ativos: response.carteira.ativos.map((ativo) => ({
            id: parseInt(ativo.id),
            ticker: ativo.ticker || "",
            tipo_ativo: ativo.categoria,
            quantidade: ativo.quantidade,
            preco_compra: ativo.preco_compra,
            dta_compra: ativo.dta_compra,
            outros_custos: 0,
          })),
        });
      } catch (err: any) {
        console.error("Erro ao buscar carteira:", err);
        setError(err.message || "Erro ao carregar dados da carteira");
        
        if (err.message?.includes("não autorizado") || err.message?.includes("401")) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("token");
          window.location.href = "/register";
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarteira();
  }, []);

  // State for real-time actions
  const [actions, setActions] = useState<Action[]>([]);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      const randomTypes: ("income" | "expense" | "transfer")[] = [
        "income",
        "expense",
        "transfer",
      ];
      const randomType =
        randomTypes[Math.floor(Math.random() * randomTypes.length)];

      const descriptions = {
        income: ["Freelance Payment", "Investment Return", "Bonus", "Refund"],
        expense: ["Coffee Shop", "Gas Station", "Online Shopping", "Utilities"],
        transfer: [
          "Transfer to Savings",
          "Investment Transfer",
          "Emergency Fund",
        ],
      };

      const categories = {
        income: ["Income", "Investments"],
        expense: ["Food", "Entertainment", "Bills", "Other"],
        transfer: ["Savings", "Investments"],
      };

      const newAction: Action = {
        id: Date.now().toString(),
        type: randomType,
        description:
          descriptions[randomType][
            Math.floor(Math.random() * descriptions[randomType].length)
          ],
        amount: Math.floor(Math.random() * 500) + 10,
        category:
          categories[randomType][
            Math.floor(Math.random() * categories[randomType].length)
          ],
        timestamp: new Date(),
        status: Math.random() > 0.1 ? "completed" : "pending",
      };

      setActions((prev) => [newAction, ...prev].slice(0, 10)); // Keep only last 10 actions
    }, 5000); // Add new action every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // Gerar cores únicas para cada ativo
  const generateColors = (count: number) => {
    const colors = [
      { bg: "rgba(255, 99, 132, 0.6)", border: "rgba(255, 99, 132, 1)" }, // Vermelho
      { bg: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)" }, // Azul
      { bg: "rgba(255, 206, 86, 0.6)", border: "rgba(255, 206, 86, 1)" }, // Amarelo
      { bg: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)" }, // Verde água
      { bg: "rgba(153, 102, 255, 0.6)", border: "rgba(153, 102, 255, 1)" }, // Roxo
      { bg: "rgba(255, 159, 64, 0.6)", border: "rgba(255, 159, 64, 1)" }, // Laranja
      { bg: "rgba(201, 203, 207, 0.6)", border: "rgba(201, 203, 207, 1)" }, // Cinza
      { bg: "rgba(255, 99, 255, 0.6)", border: "rgba(255, 99, 255, 1)" }, // Rosa
      { bg: "rgba(99, 255, 132, 0.6)", border: "rgba(99, 255, 132, 1)" }, // Verde limão
      { bg: "rgba(99, 132, 255, 0.6)", border: "rgba(99, 132, 255, 1)" }, // Azul índigo
    ];
    
    return colors.slice(0, count);
  };

  // Preparar dados dos ativos para o gráfico de pizza
  const ativosData = carteira?.ativos || [];
  const colors = generateColors(ativosData.length);
  
  const doughnutData = {
    labels: ativosData.map((ativo) => `${ativo.ticker} (${ativo.quantidade} un)`),
    datasets: [
      {
        label: "Quantidade de Ativos",
        data: ativosData.map((ativo) => Number(ativo.quantidade)),
        backgroundColor: colors.map((c) => c.bg),
        borderColor: colors.map((c) => c.border),
        borderWidth: 1,
      },
    ],
  };

  // Preparar dados dos valores para o gráfico de barras
  const barData = {
    labels: ativosData.map((ativo) => ativo.ticker),
    datasets: [
      {
        label: "Valor Investido (R$)",
        data: ativosData.map((ativo) => Number(ativo.preco_compra) * Number(ativo.quantidade)),
        backgroundColor: colors.map((c) => c.bg),
        borderColor: colors.map((c) => c.border),
        borderWidth: 1,
      },
    ],
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "income":
        return "text-green-600 bg-green-100";
      case "expense":
        return "text-red-600 bg-red-100";
      case "transfer":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
            ✓ Completed
          </span>
        );
      case "pending":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700">
            ⏳ Pending
          </span>
        );
      case "failed":
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
            ✗ Failed
          </span>
        );
      default:
        return null;
    }
  };

  // Bar chart options
  const barOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Valor Investido por Ativo (R$)",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // Doughnut chart options
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: "Distribuição de Ativos na Carteira",
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-xl text-gray-600">Carregando carteira...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto p-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Minha carteira</h1>
            <p className="text-lg text-gray-600 mt-2">
              Saldo disponível: <span className="font-bold text-green-600">R$ {Number(carteira?.saldo || 0).toFixed(2)}</span>
            </p>
          </div>
          <Link href="/wallet/new">
            <button className="bg-black text-white px-5 py-2 cursor-pointer rounded-md hover:bg-gray-800 transition">
              + Adicionar Lançamento
            </button>
          </Link>
        </div>

        {ativosData.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8">
            Você ainda não possui ativos na carteira. Adicione seu primeiro ativo!
          </div>
        ) : (
          <div className="flex flex-row gap-8 flex-wrap">
            {/* Bar Chart Container */}
            <div className="flex-1 min-w-[400px] bg-white rounded-lg shadow-lg p-6">
              <Bar data={barData} options={barOptions} />
            </div>

            {/* Doughnut Chart Container */}
            <div className="flex-1 min-w-[400px] bg-white rounded-lg shadow-lg p-6 flex items-center justify-center">
              <div className="w-full max-w-md">
                <Doughnut data={doughnutData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        )}

        {/* Tabela de Ativos */}
        {ativosData.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Meus Ativos</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Ticker
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Tipo
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Quantidade
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Preço de Compra
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">
                      Valor Total
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">
                      Data de Compra
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ativosData.map((ativo, index) => (
                    <tr
                      key={ativo.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm font-bold"
                          style={{
                            backgroundColor: colors[index]?.bg || "rgba(201, 203, 207, 0.6)",
                            color: "#333",
                          }}
                        >
                          {ativo.ticker}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {ativo.tipo_ativo}
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-800">
                        {ativo.quantidade}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-800">
                        R$ {Number(ativo.preco_compra).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-green-600">
                        R$ {(Number(ativo.preco_compra) * Number(ativo.quantidade)).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(ativo.dta_compra).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td colSpan={4} className="py-3 px-4 text-right font-bold text-gray-800">
                      Valor Total Investido:
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600 text-lg">
                      R${" "}
                      {ativosData
                        .reduce((total, ativo) => total + (Number(ativo.preco_compra) * Number(ativo.quantidade)), 0)
                        .toFixed(2)}
                    </td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Real-Time Actions Table */}
        <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Transações recentes
            </h2>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Ao vivo</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Type
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Description
                  </th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">
                    Category
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Amount
                  </th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-700">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {actions.map((action, index) => (
                  <tr
                    key={action.id}
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      index === 0 ? "animate-[fadeIn_0.5s_ease-in]" : ""
                    }`}
                  >
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${getTypeColor(
                          action.type
                        )}`}
                      >
                        {action.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-800">
                      {action.description}
                    </td>
                    <td className="py-3 px-4 text-gray-600">
                      {action.category}
                    </td>
                    <td
                      className={`py-3 px-4 text-right font-semibold ${
                        action.type === "income"
                          ? "text-green-600"
                          : action.type === "expense"
                          ? "text-red-600"
                          : "text-blue-600"
                      }`}
                    >
                      {action.type === "income"
                        ? "+"
                        : action.type === "expense"
                        ? "-"
                        : "→"}{" "}
                      ${action.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {getStatusBadge(action.status)}
                    </td>
                    <td className="py-3 px-4 text-right text-sm text-gray-500">
                      {formatTime(action.timestamp)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {actions.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Não há transações recentes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
