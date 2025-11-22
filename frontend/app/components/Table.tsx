import React from "react";

interface TableProps {
  stocks: {
    [key: string]: {
      currentPrice: number;
    };
  };
}

export default function Table({ stocks }: TableProps) {
  return (
    <table className="w-full text-center border-collapse">
      <thead>
        <tr className="bg-purple-600 text-white">
          <th className="p-2">Ticker</th>
          <th className="p-2">Preço Atual (R$)</th>
        </tr>
      </thead>
      <tbody>
        {Object.entries(stocks).map(([ticker, data]) => (
          <tr key={ticker} className="border-b">
            <td className="p-2 font-semibold">{ticker}</td>
            <td className="p-2">
              {data?.currentPrice
                ? `R$ ${data.currentPrice.toFixed(2)}`
                : "Carregando..."}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
