from flask import jsonify

def render_stock(stock):
    if stock is None:
        return jsonify({}), 404

    if isinstance(stock, list) and all(hasattr(s, "to_dict") for s in stock):
        return jsonify([s.to_dict() for s in stock])

    return jsonify({"error": "Formato de dados não suportado"}), 500


def render_stock_info(stock_info):
    if stock_info is None:

        return jsonify({}), 404
    return jsonify(stock_info)

def render_montecarlo(result):
    if result is None:
        return jsonify({}), 404
    return jsonify(result.to_dict())
