class Stock:
    def __init__(self, ticker, close, high, low, open, volume,date):
        self.ticker = ticker
        self.close = float(close)
        self.open = float(open)
        self.high = float(high)
        self.low = float(low)
        self.volume = int(volume)
        self.date = str(date)
    def to_dict(self):
        return {
            "ticker": self.ticker,
            "close": self.close,
            "open": self.open,
            "high": self.high,
            "low": self.low,
            "volume": self.volume,
            "date": self.date,

        }


class StockInfo:
    def __init__(self, ticker, ebitda, floatShares, overallRisk, targetHighPrice, targetLowPrice,
                 targetMeanPrice, targetMedianPrice, totalDebt, bookValue, eps, annualDividendPerShare,
                 totalEquity, cash, revenue, netIncome, lastYearRevenue, fiftyTwoWeekHigh, fiftyTwoWeekLow,
                 priceToEarningsRatio, dividendYield, debtToEquity, enterpriseValue, enterpriseToEbitda,
                 enterpriseToRevenue, marketCap, priceToBook, payoutRatio, returnOnEquity, revenueGrowth, revenuePerShare,
                 fiftyTwoWeekHighChange, fiftyTwoWeekHighChangePercent, fiftyTwoWeekLowChange, fiftyTwoWeekLowChangePercent, currentPrice):
        
        self.ticker = ticker
        self.ebitda = ebitda
        self.floatShares = floatShares
        self.overallRisk = overallRisk
        self.targetHighPrice = targetHighPrice
        self.targetLowPrice = targetLowPrice
        self.targetMeanPrice = targetMeanPrice
        self.targetMedianPrice = targetMedianPrice
        self.totalDebt = totalDebt

        self.bookValue = bookValue
        self.eps = eps
        self.annualDividendPerShare = annualDividendPerShare
        self.totalEquity = totalEquity
        self.cash = cash
        self.revenue = revenue
        self.netIncome = netIncome
        self.lastYearRevenue = lastYearRevenue
        self.fiftyTwoWeekHigh = fiftyTwoWeekHigh
        self.fiftyTwoWeekLow = fiftyTwoWeekLow

        self.priceToEarningsRatio = priceToEarningsRatio
        self.dividendYield = dividendYield
        self.debtToEquity = debtToEquity
        self.enterpriseValue = enterpriseValue
        self.enterpriseToEbitda = enterpriseToEbitda
        self.enterpriseToRevenue = enterpriseToRevenue
        self.marketCap = marketCap
        self.priceToBook = priceToBook
        self.payoutRatio = payoutRatio
        self.returnOnEquity = returnOnEquity
        self.revenueGrowth = revenueGrowth
        self.revenuePerShare = revenuePerShare
        self.fiftyTwoWeekHighChange = fiftyTwoWeekHighChange
        self.fiftyTwoWeekHighChangePercent = fiftyTwoWeekHighChangePercent
        self.fiftyTwoWeekLowChange = fiftyTwoWeekLowChange
        self.fiftyTwoWeekLowChangePercent = fiftyTwoWeekLowChangePercent

        self.currentPrice = currentPrice
    def to_dict(self):
        return {
            "ticker": self.ticker,
            "ebitda": self.ebitda,
            "floatShares": self.floatShares,
            "overallRisk": self.overallRisk,
            "targetHighPrice": self.targetHighPrice,
            "targetLowPrice": self.targetLowPrice,
            "targetMeanPrice": self.targetMeanPrice,
            "targetMedianPrice": self.targetMedianPrice,
            "totalDebt": self.totalDebt,
            "bookValue": self.bookValue,
            "eps": self.eps,
            "annualDividendPerShare": self.annualDividendPerShare,
            "totalEquity": self.totalEquity,
            "cash": self.cash,
            "revenue": self.revenue,
            "netIncome": self.netIncome,
            "lastYearRevenue": self.lastYearRevenue,
            "fiftyTwoWeekHigh": self.fiftyTwoWeekHigh,
            "fiftyTwoWeekLow": self.fiftyTwoWeekLow,
            "priceToEarningsRatio": self.priceToEarningsRatio,
            "dividendYield": self.dividendYield,
            "debtToEquity": self.debtToEquity,
            "enterpriseValue": self.enterpriseValue,
            "enterpriseToEbitda": self.enterpriseToEbitda,
            "enterpriseToRevenue": self.enterpriseToRevenue,
            "marketCap": self.marketCap,
            "priceToBook": self.priceToBook,
            "payoutRatio": self.payoutRatio,
            "returnOnEquity": self.returnOnEquity,
            "revenueGrowth": self.revenueGrowth,
            "revenuePerShare": self.revenuePerShare,
            "fiftyTwoWeekHighChange": self.fiftyTwoWeekHighChange,
            "fiftyTwoWeekHighChangePercent": self.fiftyTwoWeekHighChangePercent,
            "fiftyTwoWeekLowChange": self.fiftyTwoWeekLowChange,
            "fiftyTwoWeekLowChangePercent": self.fiftyTwoWeekLowChangePercent,
            "currentPrice": self.currentPrice
        }
    

class MonteCarloResult:
    def __init__(self, simulation_df):
        self.simulation = simulation_df.to_dict()

    def to_dict(self):
        return {
            "simulation": self.simulation
        }