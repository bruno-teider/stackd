import { useEffect, useState } from "react";

export const useStockSetter = (tickers: string[]) => {
  const [stocks, setStocks] = useState<{ [key: string]: any }>({});

  useEffect(() => {
    if (!tickers || tickers.length === 0) return;

    const fetchStocks = async () => {
      try {
        const responses = await Promise.all(
          tickers.map((ticker) =>
            fetch(`http://127.0.0.1:5000/stock/${ticker}`).then((res) =>
              res.json()
            )
          )
        );

        const dataFormatted = responses.reduce((acc, data, index) => {
          acc[tickers[index]] = data;
          return acc;
        }, {} as any);

        setStocks(dataFormatted);
      } catch (error) {
        console.error("Erro ao buscar stocks:", error);
      }
    };

    fetchStocks();
  }, [tickers]);

  return { stocks };
};
