"use client";
import { useState } from "react";
import { Header } from "../components/Header";

export default function InvestmentCalculator() {
  const [activeTab, setActiveTab] = useState("graham");

  // Graham Calculator State
  const [grahamPrice, setGrahamPrice] = useState("");
  const [annualDividend, setAnnualDividend] = useState("");
  const [desiredReturn, setDesiredReturn] = useState("");
  const [grahamResults, setGrahamResults] = useState(null);

  // Preço Teto Calculator State
  const [tetoCurrentPrice, setTetoCurrentPrice] = useState("");
  const [tetoTargetPrice, setTetoTargetPrice] = useState("");
  const [tetoResults, setTetoResults] = useState(null);

  // Juros Compostos Calculator State
  const [initialValue, setInitialValue] = useState("");
  const [monthlyContribution, setMonthlyContribution] = useState("");
  const [annualRate, setAnnualRate] = useState("");
  const [years, setYears] = useState("");
  const [compostosResults, setCompostosResults] = useState(null);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  };

  const parseCurrency = (value) => {
    return parseFloat(value.replace(/[^\d,]/g, "").replace(",", ".")) || 0;
  };

  const handleGrahamCalculate = () => {
    const price = parseCurrency(grahamPrice);
    const dividend = parseCurrency(annualDividend);
    const returnRate = parseFloat(desiredReturn.replace(",", ".")) || 0;

    if (price > 0 && dividend > 0 && returnRate > 0) {
      const ceilingPrice = (dividend / returnRate) * 100;
      const safetyMargin = ((ceilingPrice - price) / ceilingPrice) * 100;

      setGrahamResults({
        ceilingPrice: ceilingPrice.toFixed(2),
        safetyMargin: safetyMargin.toFixed(2),
      });
    }
  };

  const handleTetoCalculate = () => {
    const current = parseCurrency(tetoCurrentPrice);
    const target = parseCurrency(tetoTargetPrice);

    if (current > 0 && target > 0) {
      const potentialReturn = ((target - current) / current) * 100;
      const recommendation =
        current <= target ? "Compra recomendada" : "Preço acima do teto";

      setTetoResults({
        potentialReturn: potentialReturn.toFixed(2),
        recommendation,
      });
    }
  };

  const handleCompostosCalculate = () => {
    const initial = parseCurrency(initialValue);
    const monthly = parseCurrency(monthlyContribution);
    const rate = parseFloat(annualRate.replace(",", ".")) || 0;
    const period = parseInt(years) || 0;

    if (initial >= 0 && monthly >= 0 && rate > 0 && period > 0) {
      const monthlyRate = rate / 100 / 12;
      const months = period * 12;

      let futureValue = initial * Math.pow(1 + monthlyRate, months);

      if (monthly > 0) {
        futureValue +=
          monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
      }

      const totalInvested = initial + monthly * months;
      const earnings = futureValue - totalInvested;

      setCompostosResults({
        futureValue: futureValue.toFixed(2),
        totalInvested: totalInvested.toFixed(2),
        earnings: earnings.toFixed(2),
      });
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#ECECEC] py-12">
        <div className="mx-auto max-w-5xl ">
          {/* Tab Buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => setActiveTab("graham")}
              className={`px-6 py-2 rounded-lg font-medium cursor-pointer border-1 border-purple-600 transition-all ${
                activeTab === "graham"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-black hover:bg-purple-200"
              }`}
            >
              Graham
            </button>
            <button
              onClick={() => setActiveTab("teto")}
              className={`px-6 py-2 rounded-lg font-medium cursor-pointer border-1 border-purple-600 transition-all ${
                activeTab === "teto"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-black hover:bg-purple-200"
              }`}
            >
              Preço Teto
            </button>
            <button
              onClick={() => setActiveTab("compostos")}
              className={`px-6 py-2 rounded-lg font-medium cursor-pointer border-1 border-purple-600 transition-all ${
                activeTab === "compostos"
                  ? "bg-purple-600 text-white shadow-lg"
                  : "bg-white text-black hover:bg-purple-200"
              }`}
            >
              Juros Compostos
            </button>
          </div>

          {/* Graham Calculator */}
          {activeTab === "graham" && (
            <div className="bg-black rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Cotação Atual
                  </label>
                  <input
                    type="text"
                    value={grahamPrice}
                    onChange={(e) => setGrahamPrice(e.target.value)}
                    placeholder="R$0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Dividendo Anual
                  </label>
                  <input
                    type="text"
                    value={annualDividend}
                    onChange={(e) => setAnnualDividend(e.target.value)}
                    placeholder="R$0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Taxa de Retorno Desejada
                  </label>
                  <input
                    type="text"
                    value={desiredReturn}
                    onChange={(e) => setDesiredReturn(e.target.value)}
                    placeholder="R$0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={handleGrahamCalculate}
                className="w-full md:w-auto ml-auto block cursor-pointer bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Calcular
              </button>

              {grahamResults && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-white text-3xl font-semibold mb-6">
                    Resultados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 text-lg">↗</span>
                        <p className="text-gray-400 text-lg">Preço Teto</p>
                      </div>
                      <p className="text-gray-500 text-xs mb-4">
                        Valor máximo recomendado para compra
                      </p>
                      <p className="text-white text-3xl font-bold">
                        {grahamResults.ceilingPrice}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 text-lg">●</span>
                        <p className="text-gray-400 text-lg">
                          Margem de segurança
                        </p>
                      </div>
                      <p className="text-gray-500 text-xs mb-4">
                        Potencial de valorização do ativo
                      </p>
                      <p className="text-white text-3xl font-bold">
                        {grahamResults.safetyMargin}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Preço Teto Calculator */}
          {activeTab === "teto" && (
            <div className="bg-black rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Preço Atual
                  </label>
                  <input
                    type="text"
                    value={tetoCurrentPrice}
                    onChange={(e) => setTetoCurrentPrice(e.target.value)}
                    placeholder="R$0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Preço Teto
                  </label>
                  <input
                    type="text"
                    value={tetoTargetPrice}
                    onChange={(e) => setTetoTargetPrice(e.target.value)}
                    placeholder="R$0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={handleTetoCalculate}
                className="w-full md:w-auto ml-auto block bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Calcular
              </button>

              {tetoResults && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-white text-3xl font-semibold mb-6">
                    Resultados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 text-lg">↗</span>
                        <p className="text-gray-400 text-lg">
                          Retorno Potencial
                        </p>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        Valorização esperada
                      </p>
                      <p className="text-white text-3xl font-bold">
                        {tetoResults.potentialReturn}%
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 text-lg">●</span>
                        <p className="text-gray-400 text-lg">Recomendação</p>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        Análise do preço
                      </p>
                      <p className="text-white text-xl font-bold">
                        {tetoResults.recommendation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Juros Compostos Calculator */}
          {activeTab === "compostos" && (
            <div className="bg-black rounded-2xl p-8 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Valor Inicial
                  </label>
                  <input
                    type="text"
                    value={initialValue}
                    onChange={(e) => setInitialValue(e.target.value)}
                    placeholder="R$0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Aporte Mensal
                  </label>
                  <input
                    type="text"
                    value={monthlyContribution}
                    onChange={(e) => setMonthlyContribution(e.target.value)}
                    placeholder="R$0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Taxa Anual (%)
                  </label>
                  <input
                    type="text"
                    value={annualRate}
                    onChange={(e) => setAnnualRate(e.target.value)}
                    placeholder="0,00"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-white text-sm font-medium mb-2">
                    Período (anos)
                  </label>
                  <input
                    type="text"
                    value={years}
                    onChange={(e) => setYears(e.target.value)}
                    placeholder="0"
                    className="w-full bg-gray-900 border border-purple-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              <button
                onClick={handleCompostosCalculate}
                className="w-full md:w-auto ml-auto block bg-purple-600 hover:bg-purple-700 text-white font-medium px-8 py-3 rounded-lg transition-colors"
              >
                Calcular
              </button>

              {compostosResults && (
                <div className="mt-8 pt-8 border-t border-gray-800">
                  <h3 className="text-white text-3xl font-semibold mb-6">
                    Resultados
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-green-400 text-lg">↗</span>
                        <p className="text-gray-400 text-lg">Valor Futuro</p>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        Total acumulado
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {formatCurrency(
                          parseFloat(compostosResults.futureValue)
                        )}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-400 text-lg">●</span>
                        <p className="text-gray-400 text-lg">Total Investido</p>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        Valor aportado
                      </p>
                      <p className="text-white text-2xl font-bold">
                        {formatCurrency(
                          parseFloat(compostosResults.totalInvested)
                        )}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-yellow-400 text-lg">●</span>
                        <p className="text-gray-400 text-lg">Rendimento</p>
                      </div>
                      <p className="text-gray-500 text-xs mb-2">Lucro obtido</p>
                      <p className="text-white text-2xl font-bold">
                        {formatCurrency(parseFloat(compostosResults.earnings))}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
