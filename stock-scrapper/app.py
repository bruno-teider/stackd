# backend/app.py
from flask import Flask
from controllers.stock_controller import get_stock, get_stock_info, get_montecarlo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/stock/<ticker>/<timestamp>")
def get_stock_data(ticker, timestamp):
    return get_stock(ticker,timestamp)


@app.route("/stock/<ticker>")
def get_stock_information(ticker):
    return get_stock_info(ticker)


@app.route("/montecarlo/<ticker>")
def montecarlo_route(ticker):
    return get_montecarlo(ticker)

if __name__ == "__main__":
    app.run(debug=True)


