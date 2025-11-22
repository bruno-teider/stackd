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
  const [filtroCategoria, setFiltroCategoria] = useState<string>("GERAL"); // GERAL, CRIPTO, ACAO, FUNDO

  // Buscar dados da carteira
  useEffect(() => {
    const fetchCarteira = async () => {
      try {
        setLoading(true);
        const token =
          localStorage.getItem("access_token") || localStorage.getItem("token");

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

        if (
          err.message?.includes("não autorizado") ||
          err.message?.includes("401")
        ) {
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
  const categories = {
    income: ["Income", "Investments"],
    expense: ["Food", "Entertainment", "Bills", "Other"],
    transfer: ["Savings", "Investments"],
  };

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
  const todosAtivos = carteira?.ativos || [];

  // Filtrar ativos baseado na categoria selecionada
  const ativosData =
    filtroCategoria === "GERAL"
      ? todosAtivos
      : todosAtivos.filter((ativo) => {
          const tipo = ativo.tipo_ativo?.toUpperCase();
          if (filtroCategoria === "CRIPTO") {
            return tipo === "CRIPTO" || tipo === "CRIPTOMOEDAS";
          }
          if (filtroCategoria === "ACAO") {
            return tipo === "ACAO" || tipo === "AÇÕES";
          }
          if (filtroCategoria === "FUNDO") {
            return tipo === "FUNDO" || tipo === "FUNDOS";
          }
          return false;
        });

  // Agrupar ativos por categoria
  const categorias = ativosData.reduce((acc, ativo) => {
    const categoria = ativo.tipo_ativo || "Outros";
    if (!acc[categoria]) {
      acc[categoria] = [];
    }
    acc[categoria].push(ativo);
    return acc;
  }, {} as Record<string, typeof ativosData>);

  // Cores por categoria
  const categoriaColors: Record<string, { bg: string; border: string }> = {
    ACAO: { bg: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)" }, // Azul
    CRIPTO: { bg: "rgba(255, 206, 86, 0.6)", border: "rgba(255, 206, 86, 1)" }, // Amarelo/Dourado
    FUNDO: { bg: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)" }, // Verde água
    Ações: { bg: "rgba(54, 162, 235, 0.6)", border: "rgba(54, 162, 235, 1)" }, // Azul
    Criptomoedas: {
      bg: "rgba(255, 206, 86, 0.6)",
      border: "rgba(255, 206, 86, 1)",
    }, // Amarelo/Dourado
    Fundos: { bg: "rgba(75, 192, 192, 0.6)", border: "rgba(75, 192, 192, 1)" }, // Verde água
    Outros: {
      bg: "rgba(201, 203, 207, 0.6)",
      border: "rgba(201, 203, 207, 1)",
    }, // Cinza
  };

  // Cores únicas para cada ativo individual
  const colors = generateColors(ativosData.length);

  // Quando filtrado por categoria específica, mostrar os ativos individuais
  // Quando em GERAL, mostrar por categoria
  const mostrarPorCategoria = filtroCategoria === "GERAL";

  // Gráfico de Pizza principal
  const doughnutDataCategoria = mostrarPorCategoria
    ? {
        // Modo GERAL: Mostra categorias
        labels: Object.keys(categorias),
        datasets: [
          {
            label: "Valor Investido por Categoria (R$)",
            data: Object.values(categorias).map((ativos) =>
              ativos.reduce(
                (sum, ativo) =>
                  sum + Number(ativo.preco_compra) * Number(ativo.quantidade),
                0
              )
            ),
            backgroundColor: Object.keys(categorias).map(
              (cat) => categoriaColors[cat]?.bg || "rgba(201, 203, 207, 0.6)"
            ),
            borderColor: Object.keys(categorias).map(
              (cat) => categoriaColors[cat]?.border || "rgba(201, 203, 207, 1)"
            ),
            borderWidth: 2,
          },
        ],
      }
    : {
        // Modo FILTRADO: Mostra ativos individuais da categoria
        labels: ativosData.map(
          (ativo) => `${ativo.ticker} (${ativo.quantidade} un)`
        ),
        datasets: [
          {
            label: "Valor Investido por Ativo (R$)",
            data: ativosData.map(
              (ativo) => Number(ativo.preco_compra) * Number(ativo.quantidade)
            ),
            backgroundColor: colors.map((c) => c.bg),
            borderColor: colors.map((c) => c.border),
            borderWidth: 2,
          },
        ],
      };

  // Gráfico de Pizza detalhado (todos os ativos)
  const doughnutData = {
    labels: ativosData.map(
      (ativo) => `${ativo.ticker} (${ativo.quantidade} un)`
    ),
    datasets: [
      {
        label: "Valor Investido por Ativo (R$)",
        data: ativosData.map(
          (ativo) => Number(ativo.preco_compra) * Number(ativo.quantidade)
        ),
        backgroundColor: colors.map((c) => c.bg),
        borderColor: colors.map((c) => c.border),
        borderWidth: 1,
      },
    ],
  };

  // Preparar dados dos valores para o gráfico de barras
  const barData = mostrarPorCategoria
    ? {
        // Modo GERAL: Barras empilhadas por categoria
        labels: Object.keys(categorias),
        datasets: Object.keys(categorias).flatMap((categoria) => {
          const ativos = categorias[categoria];
          return ativos.map((ativo, idx) => ({
            label: ativo.ticker,
            data: Object.keys(categorias).map((cat) =>
              cat === categoria
                ? Number(ativo.preco_compra) * Number(ativo.quantidade)
                : 0
            ),
            backgroundColor:
              colors[ativosData.indexOf(ativo)]?.bg ||
              "rgba(201, 203, 207, 0.6)",
            borderColor:
              colors[ativosData.indexOf(ativo)]?.border ||
              "rgba(201, 203, 207, 1)",
            borderWidth: 1,
            stack: categoria,
          }));
        }),
      }
    : {
        // Modo FILTRADO: Barras simples para cada ativo
        labels: ativosData.map((ativo) => ativo.ticker),
        datasets: [
          {
            label: "Valor Investido (R$)",
            data: ativosData.map(
              (ativo) => Number(ativo.preco_compra) * Number(ativo.quantidade)
            ),
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
        position: mostrarPorCategoria ? ("right" as const) : ("top" as const),
        labels: {
          boxWidth: 12,
          padding: 8,
        },
      },
      title: {
        display: true,
        text: mostrarPorCategoria
          ? "Ativos Agrupados por Categoria"
          : `Ativos de ${
              filtroCategoria === "ACAO"
                ? "Ações"
                : filtroCategoria === "CRIPTO"
                ? "Criptomoedas"
                : "Fundos"
            }`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.dataset.label || "";
            const value = context.parsed.y || 0;
            return `${label}: R$ ${value.toFixed(2)}`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: mostrarPorCategoria,
        title: {
          display: true,
          text: mostrarPorCategoria ? "Categorias" : "Ativos",
        },
      },
      y: {
        stacked: mostrarPorCategoria,
        beginAtZero: true,
        title: {
          display: true,
          text: "Valor Investido (R$)",
        },
      },
    },
  };

  // Doughnut chart options - Categorias ou Ativos (gráfico principal)
  const doughnutOptionsCategorias = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
      },
      title: {
        display: true,
        text: mostrarPorCategoria
          ? "Distribuição por Categoria"
          : `${
              filtroCategoria === "ACAO"
                ? "Ações"
                : filtroCategoria === "CRIPTO"
                ? "Criptomoedas"
                : "Fundos"
            } na Carteira`,
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  // Doughnut chart options - Ativos detalhados
  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 6,
          font: {
            size: 10,
          },
        },
      },
      title: {
        display: true,
        text: "Todos os Ativos Detalhados",
        font: {
          size: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            const label = context.label || "";
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce(
              (a: number, b: number) => a + b,
              0
            );
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: R$ ${value.toFixed(2)} (${percentage}%)`;
          },
        },
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
            <h1 className="text-4xl font-bold text-gray-800">
              Minha carteira
              {filtroCategoria !== "GERAL" && (
                <span className="text-2xl ml-3 text-gray-500">
                  •{" "}
                  {filtroCategoria === "ACAO"
                    ? "Ações"
                    : filtroCategoria === "CRIPTO"
                    ? "Criptomoedas"
                    : "Fundos"}
                </span>
              )}
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-lg text-gray-600"></p>
              {filtroCategoria !== "GERAL" && ativosData.length > 0 && (
                <p className="text-lg text-gray-600">
                  • Investido (
                  {filtroCategoria === "ACAO"
                    ? "Ações"
                    : filtroCategoria === "CRIPTO"
                    ? "Cripto"
                    : "Fundos"}
                  ):
                  <span className="font-bold text-blue-600 ml-1">
                    R${" "}
                    {ativosData
                      .reduce(
                        (sum, ativo) =>
                          sum +
                          Number(ativo.preco_compra) * Number(ativo.quantidade),
                        0
                      )
                      .toFixed(2)}
                  </span>
                </p>
              )}
            </div>
          </div>
          <Link href="/wallet/new">
            <button className="bg-black text-white px-5 py-2 cursor-pointer rounded-md hover:bg-gray-800 transition">
              + Adicionar Lançamento
            </button>
          </Link>
        </div>

        {/* Botões de Filtro */}
        {todosAtivos.length > 0 && (
          <div className="mb-6 flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">
              Filtrar por:
            </span>
            <div className="flex gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setFiltroCategoria("GERAL")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filtroCategoria === "GERAL"
                    ? "bg-white shadow-md text-gray-900"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📊 Geral
              </button>
              <button
                onClick={() => setFiltroCategoria("ACAO")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filtroCategoria === "ACAO"
                    ? "bg-blue-500 shadow-md text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📈 Ações
              </button>
              <button
                onClick={() => setFiltroCategoria("CRIPTO")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filtroCategoria === "CRIPTO"
                    ? "bg-yellow-500 shadow-md text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                ₿ Cripto
              </button>
              <button
                onClick={() => setFiltroCategoria("FUNDO")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                  filtroCategoria === "FUNDO"
                    ? "bg-green-500 shadow-md text-white"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                💼 Fundos
              </button>
            </div>
            {filtroCategoria !== "GERAL" && (
              <span className="text-xs text-gray-500">
                ({ativosData.length}{" "}
                {ativosData.length === 1 ? "ativo" : "ativos"} encontrado
                {ativosData.length !== 1 ? "s" : ""})
              </span>
            )}
          </div>
        )}

        {ativosData.length === 0 && todosAtivos.length > 0 ? (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-8">
            Nenhum ativo encontrado na categoria selecionada. Tente outro
            filtro.
          </div>
        ) : ativosData.length === 0 ? (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-8">
            Você ainda não possui ativos na carteira. Adicione seu primeiro
            ativo!
          </div>
        ) : (
          <>
            {/* Primeira linha - Gráfico Principal */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="w-full max-w-2xl mx-auto">
                  <Doughnut
                    data={doughnutDataCategoria}
                    options={doughnutOptionsCategorias}
                  />
                </div>
              </div>
            </div>

            {/* Segunda linha - Gráfico de Barras */}
            <div className="mb-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <Bar data={barData} options={barOptions} />
              </div>
            </div>

            {/* Terceira linha (apenas em modo GERAL) - Pizza Detalhada */}
            {mostrarPorCategoria && (
              <div className="mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="w-full max-w-2xl mx-auto">
                    <Doughnut data={doughnutData} options={doughnutOptions} />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Cards de Resumo por Categoria */}
        {ativosData.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            {Object.entries(categorias).map(([categoria, ativos]) => {
              const totalInvestido = ativos.reduce(
                (sum, ativo) =>
                  sum + Number(ativo.preco_compra) * Number(ativo.quantidade),
                0
              );
              const cor =
                categoriaColors[categoria] || categoriaColors["Outros"];

              return (
                <div
                  key={categoria}
                  className="bg-white rounded-lg shadow-lg p-6 border-l-4"
                  style={{ borderColor: cor.border }}
                >
                  <h3 className="text-lg font-bold text-gray-800 mb-2">
                    {categoria}
                  </h3>
                  <p
                    className="text-3xl font-bold mb-2"
                    style={{ color: cor.border }}
                  >
                    R$ {totalInvestido.toFixed(2)}
                  </p>
                  <p className="text-sm text-gray-600 mb-3">
                    {ativos.length} {ativos.length === 1 ? "ativo" : "ativos"}
                  </p>
                  <div className="space-y-1">
                    {ativos.map((ativo) => (
                      <div
                        key={ativo.id}
                        className="flex justify-between text-xs text-gray-600"
                      >
                        <span className="font-medium">{ativo.ticker}</span>
                        <span>{ativo.quantidade} un</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tabela de Ativos */}
        {ativosData.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Meus Ativos
            </h2>
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
                            backgroundColor:
                              colors[index]?.bg || "rgba(201, 203, 207, 0.6)",
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
                        R${" "}
                        {(
                          Number(ativo.preco_compra) * Number(ativo.quantidade)
                        ).toFixed(2)}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {new Date(ativo.dta_compra).toLocaleDateString("pt-BR")}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="border-t-2 border-gray-300">
                    <td
                      colSpan={4}
                      className="py-3 px-4 text-right font-bold text-gray-800"
                    >
                      Valor Total Investido:
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-green-600 text-lg">
                      R${" "}
                      {ativosData
                        .reduce(
                          (total, ativo) =>
                            total +
                            Number(ativo.preco_compra) *
                              Number(ativo.quantidade),
                          0
                        )
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
      </div>
    </div>
  );
}
