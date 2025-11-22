"use client";

import React, { useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// ================= TIPOS =================

interface Ativo {
  ticker: string;
  percentual: number;
}

interface Carteira {
  perfil: "conservador" | "moderado" | "arrojado";
  rendaVariavel: number;
  rendaFixa: number;
  ativos: Ativo[];
}

// ================= CARTEIRAS EXEMPLO =================

const CARTEIRAS: Record<string, Carteira> = {
  conservador: {
    perfil: "conservador",
    rendaVariavel: 25,
    rendaFixa: 75,
    ativos: [
      { ticker: "Bolsa Internacional", percentual: 15 },
      { ticker: "Bolsa Brasileira", percentual: 10 },
      { ticker: "Tesouro pré-fixado", percentual: 15 },
      { ticker: "Tesouro IPCA+", percentual: 60 },
    ],
  },

  moderado: {
    perfil: "moderado",
    rendaVariavel: 60,
    rendaFixa: 40,
    ativos: [
      { ticker: "Cripto", percentual: 5 },
      { ticker: "Bolsa Internacional", percentual: 25 },
      { ticker: "Bolsa Brasil", percentual: 30 },
      { ticker: "Tesouro pré-fixado", percentual: 20 },
      { ticker: "Tesouro IPCA+", percentual: 20 },
    ],
  },

  arrojado: {
    perfil: "arrojado",
    rendaVariavel: 75,
    rendaFixa: 25,
    ativos: [
      { ticker: "Cripto", percentual: 10 },
      { ticker: "Bolsa internacional,", percentual: 35 },
      { ticker: "Bolsa Brasil", percentual: 30 },
      { ticker: "Renda Fixa", percentual: 25 },
    ],
  },
};

// ================= CORES =================

const COLORS = [
  "#4f46e5",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#7c3aed",
  "#0891b2",
  "#be123c",
];

// ================= COMPONENTE =================

export default function CarteiraInvestimento() {
  const [perfilSelecionado, setPerfilSelecionado] = useState("conservador");

  const carteira = CARTEIRAS[perfilSelecionado];

  const dataGrafico = carteira.ativos.map((ativo) => ({
    name: ativo.ticker,
    value: ativo.percentual,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-black">
        Carteira Recomendada
      </h2>

      {/* Seleção de Perfil */}
      <div className="flex gap-3 mb-6">
        {Object.keys(CARTEIRAS).map((perfil) => (
          <button
            key={perfil}
            onClick={() => setPerfilSelecionado(perfil)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              perfilSelecionado === perfil
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {perfil.charAt(0).toUpperCase() + perfil.slice(1)}
          </button>
        ))}
      </div>

      {/* Resumo RV/RF */}
      <div className="flex justify-around mb-6 text-center">
        <div>
          <p className="text-sm text-gray-500">Renda Variável</p>
          <p className="text-xl font-bold text-indigo-600">
            {carteira.rendaVariavel}%
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Renda Fixa</p>
          <p className="text-xl font-bold text-green-600">
            {carteira.rendaFixa}%
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="w-full h-80">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={dataGrafico}
              cx="50%"
              cy="50%"
              outerRadius={110}
              dataKey="value"
              label={(entry: any) => `${entry.name} ${entry.value}%`}
            >
              {dataGrafico.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Lista de ativos */}
      <div className="mt-6">
        <h3 className="font-semibold text-black mb-2">Ativos da Carteira</h3>
        <ul className="space-y-2">
          {carteira.ativos.map((ativo) => (
            <li
              key={ativo.ticker}
              className="flex justify-between bg-gray-50 p-3 rounded-lg"
            >
              <span className="font-medium text-gray-800">{ativo.ticker}</span>
              <span className="text-gray-600">{ativo.percentual}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
