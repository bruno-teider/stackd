"use client";
import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Header } from "../../components/Header";
import { carteiraService } from "../../../services/api";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function NewTransactionPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"compra" | "venda">("compra");
  const [assetType, setAssetType] = useState("Ações");
  const [asset, setAsset] = useState("");
  const [date, setDate] = useState(() => {
    const d = new Date();
    return d.toISOString().slice(0, 10);
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [price, setPrice] = useState<number>(0);
  const [otherCosts, setOtherCosts] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(() => {
    const q = Number(quantity) || 0;
    const p = Number(price) || 0;
    const o = Number(otherCosts) || 0;
    return p * q + o;
  }, [quantity, price, otherCosts]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Preparar payload compatível com o backend
      const categoriaMap: Record<string, string> = {
        Ações: 'ACAO',
        Criptomoedas: 'CRIPTO',
        Fundos: 'FUNDO',
      };

      // Obter token do localStorage
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Você precisa fazer login para realizar esta operação');
      }

      if (mode === 'compra') {
        // Comprar ativo
        const response = await carteiraService.comprarAtivo(token, {
          categoria: categoriaMap[assetType] || assetType,
          ticker: asset || '',
          preco_compra: Number(price) || 0,
          quantidade: Number(quantity) || 0,
          dta_compra: date,
          outros_custos: Number(otherCosts) || 0,
        });

        alert(`✅ ${response.message}\nSaldo restante: R$ ${response.saldo_restante?.toFixed(2)}`);
      } else {
        // Vender ativo
        const response = await carteiraService.venderAtivo(token, {
          ticker: asset || undefined,
          quantidade: Number(quantity) || 0,
          preco_venda: Number(price) || 0,
        });

        alert(`✅ ${response.message}\nSaldo atual: R$ ${response.saldo_atual?.toFixed(2)}`);
      }

      // Redirecionar para a página da carteira após sucesso
      router.push('/wallet');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar operação';
      setError(errorMessage);
      console.error('Erro ao salvar lançamento:', err);
      
      if (errorMessage.includes('login') || errorMessage.includes('autorizado')) {
        // Redirecionar para login se não autorizado
        setTimeout(() => router.push('/'), 2000);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <Header />
      <div className="p-6 max-w-3xl mx-auto text-gray-800">
        <h1 className="text-2xl font-bold mb-4">Adicionar Lançamento</h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-gray-100 shadow-lg rounded-xl p-6 ring-1 ring-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2 bg-gray-200 rounded-full p-1 ring-1 ring-gray-200">
              <button
                type="button"
                onClick={() => setMode("compra")}
                className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all ${
                  mode === "compra" ? "bg-white shadow" : "text-gray-600"
                }`}
              >
                Compra
              </button>
              <button
                type="button"
                onClick={() => setMode("venda")}
                className={`px-4 py-2 rounded-full cursor-pointer text-sm font-medium transition-all ${
                  mode === "venda" ? "bg-white shadow" : "text-gray-600"
                }`}
              >
                Venda
              </button>
            </div>

            <Link
              href="/wallet"
              className="text-sm bg-gray-200 px-3 py-1 rounded-md hover:bg-gray-300"
            >
              ← Voltar
            </Link>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Tipo de ativo
                </label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white"
                >
                  <option>Ações</option>
                  <option>Criptomoedas</option>
                  <option>Fundos</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ativo (Ticker)
                </label>

                <input
                  list="tickers"
                  value={asset}
                  onChange={(e) => setAsset(e.target.value.toUpperCase())}
                  placeholder="Ex: PETR4, VALE3, BTC"
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white"
                />

                <datalist id="tickers">
                  <option value="PETR4" />
                  <option value="VALE3" />
                  <option value="BBAS3" />
                  <option value="ITUB4" />
                  <option value="BTC-USD" />
                  <option value="ETH-USD" />
                </datalist>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Data da compra
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantidade
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Preço em R$
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white"
                  placeholder="0,00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Outros custos{" "}
                  <span className="text-xs text-gray-400">(Opcional)</span>
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={otherCosts}
                  onChange={(e) => setOtherCosts(Number(e.target.value))}
                  className="mt-1 w-full border border-gray-300 rounded-md p-2 bg-white"
                  placeholder="0,00"
                />
              </div>
            </div>

            <div className="mt-4 rounded-md bg-gray-200 p-3 flex items-center justify-between ring-1 ring-gray-200">
              <span className="text-sm text-gray-700">Valor total</span>
              <strong className="text-lg">{formatBRL(total)}</strong>
            </div>

            <div className="flex items-center justify-between mt-4">
              <Link
                href="/wallet"
                className="text-sm bg-gray-200 px-3 py-1 rounded-md ring-1 ring-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-black text-white px-4 py-2 cursor-pointer rounded-md flex items-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin">⏳</span>
                    Processando...
                  </>
                ) : (
                  <>+ Adicionar Lançamento</>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
