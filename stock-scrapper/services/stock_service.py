import yfinance as yf
from models.stock import Stock, StockInfo, MonteCarloResult
import numpy as np
import pandas as pd
from statsmodels.tsa.arima.model import ARIMA
#retorna close, high, low, open, volume
def getStock(ticker, timestamp='5y'):
    ticker_name = f'{ticker}.SA'
    dados = yf.download(ticker_name, period=timestamp)
    if dados.empty:
        return None

    stocks = []
    for idx, row in dados.iterrows():
        stocks.append(Stock(
            ticker=ticker,
            close=float(row['Close']),
            high=float(row['High']),
            low=float(row['Low']),
            open=float(row['Open']),
            volume=int(row['Volume']),
            date=str(idx.date())
        ))
        
    return stocks
#retorna informacoes uteis


def getStockInfo(ticker):
    data = yf.Ticker(f'{ticker}.SA').info

    # Pegar valores da API usando get() para evitar KeyError
    ebitda = data.get('ebitda', None)
    floatShares = data.get('floatShares', 0)
    overallRisk = data.get('overallRisk', None)
    targetHighPrice = data.get('targetHighPrice', None)
    targetLowPrice = data.get('targetLowPrice', None)
    targetMeanPrice = data.get('targetMeanPrice', None)
    targetMedianPrice = data.get('targetMedianPrice', None)
    totalDebt = data.get('totalDebt', 0)
    bookValue = data.get('bookValue', 0)
    eps = data.get('trailingEps', None)
    annualDividendPerShare = data.get('dividendRate', None)
    cash = data.get('totalCash', 0)
    revenue = data.get('totalRevenue', 0)
    netIncome = data.get('netIncomeToCommon', 0)
    lastYearRevenue = data.get('totalRevenue', 0)
    fiftyTwoWeekHigh = data.get('fiftyTwoWeekHigh', None)
    fiftyTwoWeekLow = data.get('fiftyTwoWeekLow', None)
    currentPrice = data.get('currentPrice', 0)
    revenueGrowth = data.get('revenueGrowth', None)

    totalEquity = bookValue * floatShares if bookValue and floatShares else 0

    # Cálculos diretos
    priceToEarningsRatio = currentPrice / eps if eps else None
    dividendYield = annualDividendPerShare / currentPrice if currentPrice else None
    debtToEquity = totalDebt / totalEquity if totalEquity else None
    enterpriseValue = (currentPrice * floatShares) + totalDebt - cash
    enterpriseToEbitda = enterpriseValue / ebitda if ebitda else None
    enterpriseToRevenue = enterpriseValue / revenue if revenue else None
    marketCap = currentPrice * floatShares
    priceToBook = data.get('PriceToBook') 
    if priceToBook == None: 
        priceToBook = (currentPrice / bookValue if bookValue else None)
    payoutRatio = annualDividendPerShare / eps if eps else None
    returnOnEquity = netIncome / totalEquity if totalEquity else None
    revenuePerShare = revenue / floatShares if floatShares else None
    fiftyTwoWeekHighChange = currentPrice - fiftyTwoWeekHigh if fiftyTwoWeekHigh else None
    fiftyTwoWeekHighChangePercent = ((currentPrice - fiftyTwoWeekHigh) / fiftyTwoWeekHigh) if fiftyTwoWeekHigh else None
    fiftyTwoWeekLowChange = currentPrice - fiftyTwoWeekLow if fiftyTwoWeekLow else None
    fiftyTwoWeekLowChangePercent = ((currentPrice - fiftyTwoWeekLow) / fiftyTwoWeekLow) if fiftyTwoWeekLow else None

    # Criar a view
    stock_info = StockInfo(
        ticker=ticker,
        ebitda=ebitda,
        floatShares=floatShares,
        overallRisk=overallRisk,
        targetHighPrice=targetHighPrice,
        targetLowPrice=targetLowPrice,
        targetMeanPrice=targetMeanPrice,
        targetMedianPrice=targetMedianPrice,
        totalDebt=totalDebt,
        bookValue=bookValue,
        eps=eps,
        annualDividendPerShare=annualDividendPerShare,
        totalEquity=totalEquity,
        cash=cash,
        revenue=revenue,
        netIncome=netIncome,
        lastYearRevenue=lastYearRevenue,
        fiftyTwoWeekHigh=fiftyTwoWeekHigh,
        fiftyTwoWeekLow=fiftyTwoWeekLow,
        priceToEarningsRatio=priceToEarningsRatio,
        dividendYield=dividendYield,
        debtToEquity=debtToEquity,
        enterpriseValue=enterpriseValue,
        enterpriseToEbitda=enterpriseToEbitda,
        enterpriseToRevenue=enterpriseToRevenue,
        marketCap=marketCap,
        priceToBook=priceToBook,
        payoutRatio=payoutRatio,
        returnOnEquity=returnOnEquity,
        revenueGrowth=revenueGrowth,
        revenuePerShare=revenuePerShare,
        fiftyTwoWeekHighChange=fiftyTwoWeekHighChange,
        fiftyTwoWeekHighChangePercent=fiftyTwoWeekHighChangePercent,
        fiftyTwoWeekLowChange=fiftyTwoWeekLowChange,
        fiftyTwoWeekLowChangePercent=fiftyTwoWeekLowChangePercent,
        currentPrice=currentPrice
    )
    return stock_info.to_dict()


def getMontecarlo(stocks, simulations=1000, days=100):
   

    # -------------------------------
    # Preparar dados
    # -------------------------------
    dados = pd.DataFrame([{
        "date": str(s.date),
        "close": s.close
    } for s in stocks])

    dados = dados.sort_values(by="date").reset_index(drop=True)
    prices = dados['close'].values

    # Ajustar modelo ARIMA
    model = ARIMA(prices, order=(1,1,1))
    fitted_model = model.fit()

    # Último preço conhecido
    last_price = prices[-1]

    # -------------------------------
    # Distribuição de retornos
    # -------------------------------
    resid_std = fitted_model.resid.std()
    resid_mean = fitted_model.resid.mean()

    # Simular retornos com base nos resíduos
    random_returns = np.random.normal(
        loc=resid_mean, 
        scale=resid_std, 
        size=(simulations, days)
    )

    # Preço inicial replicado para cada simulação
    start_prices = np.full((simulations, 1), last_price)

    # Construir séries de preços cumulativos
    price_paths = np.concatenate([start_prices, start_prices + np.cumsum(random_returns, axis=1)], axis=1)

    # -------------------------------
    # DataFrame de resultados
    # -------------------------------
    dates = pd.date_range(start=dados['date'].iloc[-1], periods=days+1, freq='D')

    simulation_df = pd.DataFrame(price_paths.T)
    simulation_df.insert(0, "date", dates)
    simulation_df.columns = simulation_df.columns.map(str)

    return MonteCarloResult(simulation_df)
