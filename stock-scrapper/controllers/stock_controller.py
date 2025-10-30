from services.stock_service import getStock
from views.stock_view import render_stock
from views.stock_view import render_stock_info
from views.stock_view import render_montecarlo
from services.stock_service import getStockInfo
from services.stock_service import getMontecarlo
def get_stock(ticker, timestamp='5y'):
    stock_data = getStock(ticker, timestamp)
    return render_stock(stock_data)


def get_stock_info(ticker):
    stock_info = getStockInfo(ticker)
    return render_stock_info(stock_info)

def get_montecarlo(ticker, simulations=1000, days=252):
    stocks = getStock(ticker)
    result = getMontecarlo(stocks, simulations, days)
    return render_montecarlo(result)
