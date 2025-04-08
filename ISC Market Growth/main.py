# main.py
from flask import Flask, render_template, jsonify
import pandas as pd

app = Flask(__name__)

# Load data
market_data = pd.read_csv('data/market_data.csv')
business_projections = pd.read_csv('data/business_projections.csv')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/market-analysis')
def api_market_analysis():
    data = {
        'labels': market_data['Year'].tolist(),
        'market_size': market_data['Market_Size'].tolist()
    }
    return jsonify(data)

@app.route('/api/business-projections')
def api_business_projections():
    data = {
        'years': business_projections['Year'].tolist(),
        'system_sales': business_projections['System_Sales'].tolist(),
        'maintenance_contracts': business_projections['Maintenance_Contracts'].tolist(),
        'data_analytics': business_projections['Data_Analytics'].tolist(),
        'total_revenue': business_projections['Total_Revenue'].tolist(),
        'laparis_share': business_projections['LAPARIS_Share'].tolist()
    }
    return jsonify(data)

@app.route('/api/market-share')
def api_market_share():
    data = {
        'labels': business_projections['Year'].tolist(),
        'laparis_share': business_projections['LAPARIS_Share'].tolist(),
        'total_market': market_data['Market_Size'].tolist()
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
