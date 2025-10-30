import React from "react";
import { useState, useEffect } from "react";

export const useStockSetter = (ticker) => {
  const [stockInfo, setStockInfo] = useState(null);

  const [ebitda, setEbitda] = useState(null);
  const [floatShares, setFloatShares] = useState(null);
  const [overallRisk, setOverallRisk] = useState(null);
  const [targetHighPrice, setTargetHighPrice] = useState(null);
  const [targetLowPrice, setTargetLowPrice] = useState(null);
  const [targetMeanPrice, setTargetMeanPrice] = useState(null);
  const [targetMedianPrice, setTargetMedianPrice] = useState(null);
  const [totalDebt, setTotalDebt] = useState(null);
  const [bookValue, setBookValue] = useState(null);
  const [eps, setEps] = useState(null);
  const [annualDividendPerShare, setAnnualDividendPerShare] = useState(null);
  const [totalEquity, setTotalEquity] = useState(null);
  const [cash, setCash] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [netIncome, setNetIncome] = useState(null);
  const [lastYearRevenue, setLastYearRevenue] = useState(null);
  const [fiftyTwoWeekHigh, setFiftyTwoWeekHigh] = useState(null);
  const [fiftyTwoWeekLow, setFiftyTwoWeekLow] = useState(null);
  const [priceToEarningsRatio, setPriceToEarningsRatio] = useState(null);
  const [dividendYield, setDividendYield] = useState(null);
  const [debtToEquity, setDebtToEquity] = useState(null);
  const [enterpriseValue, setEnterpriseValue] = useState(null);
  const [enterpriseToEbitda, setEnterpriseToEbitda] = useState(null);
  const [enterpriseToRevenue, setEnterpriseToRevenue] = useState(null);
  const [marketCap, setMarketCap] = useState(null);
  const [priceToBook, setPriceToBook] = useState(null);
  const [payoutRatio, setPayoutRatio] = useState(null);
  const [returnOnEquity, setReturnOnEquity] = useState(null);
  const [revenueGrowth, setRevenueGrowth] = useState(null);
  const [revenuePerShare, setRevenuePerShare] = useState(null);
  const [fiftyTwoWeekHighChange, setFiftyTwoWeekHighChange] = useState(null);
  const [fiftyTwoWeekHighChangePercent, setFiftyTwoWeekHighChangePercent] =
    useState(null);
  const [fiftyTwoWeekLowChange, setFiftyTwoWeekLowChange] = useState(null);
  const [fiftyTwoWeekLowChangePercent, setFiftyTwoWeekLowChangePercent] =
    useState(null);
  const [currentPrice, setCurrentPrice] = useState(null);

  useEffect(() => {
    fetch(`http://127.0.0.1:5000/stock/${ticker}`)
      .then((res) => res.json())
      .then((json) => {
        setStockInfo(json);
        setEbitda(json.ebitda);
        setFloatShares(json.floatShares);
        setTotalDebt(json.totalDebt);
        setBookValue(json.bookValue);
        setEps(json.eps);
        setAnnualDividendPerShare(json.annualDividendPerShare);
        setTotalEquity(json.totalEquity);
        setCash(json.cash);
        setRevenue(json.revenue);
        setNetIncome(json.netIncome);
        setLastYearRevenue(json.lastYearRevenue);
        setFiftyTwoWeekHigh(json.fiftyTwoWeekHigh);
        setFiftyTwoWeekLow(json.fiftyTwoWeekLow);
        setPriceToEarningsRatio(json.priceToEarningsRatio);
        setDividendYield(json.dividendYield);
        setDebtToEquity(json.debtToEquity);
        setEnterpriseValue(json.enterpriseValue);
        setEnterpriseToEbitda(json.enterpriseToEbitda);
        setEnterpriseToRevenue(json.enterpriseToRevenue);
        setMarketCap(json.marketCap);
        setPriceToBook(json.priceToBook);
        setPayoutRatio(json.payoutRatio);
        setReturnOnEquity(json.returnOnEquity);
        setRevenueGrowth(json.revenueGrowth);
        setRevenuePerShare(json.revenuePerShare);
        setFiftyTwoWeekHighChange(json.fiftyTwoWeekHighChange);
        setFiftyTwoWeekHighChangePercent(json.fiftyTwoWeekHighChangePercent);
        setFiftyTwoWeekLowChange(json.fiftyTwoWeekLowChange);
        setFiftyTwoWeekLowChangePercent(json.fiftyTwoWeekLowChangePercent);
        setCurrentPrice(json.currentPrice);
      })
      .catch(() =>
        setStockInfo({ error: "erro ao buscar os dados stockinfo" })
      );
  }, [ticker]);

  return {
    stockInfo,
    ebitda,
    floatShares,
    overallRisk,
    targetHighPrice,
    targetLowPrice,
    targetMeanPrice,
    targetMedianPrice,
    totalDebt,
    bookValue,
    eps,
    annualDividendPerShare,
    totalEquity,
    cash,
    revenue,
    netIncome,
    lastYearRevenue,
    fiftyTwoWeekHigh,
    fiftyTwoWeekLow,
    priceToEarningsRatio,
    dividendYield,
    debtToEquity,
    enterpriseValue,
    enterpriseToEbitda,
    enterpriseToRevenue,
    marketCap,
    priceToBook,
    payoutRatio,
    returnOnEquity,
    revenueGrowth,
    revenuePerShare,
    fiftyTwoWeekHighChange,
    fiftyTwoWeekHighChangePercent,
    fiftyTwoWeekLowChange,
    fiftyTwoWeekLowChangePercent,
    currentPrice,
  };
};
