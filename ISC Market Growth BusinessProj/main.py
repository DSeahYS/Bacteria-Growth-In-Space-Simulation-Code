# main.py
from flask import Flask, render_template, jsonify
import pandas as pd
import os

app = Flask(__name__)

# Load data
DATA_FILE = os.path.join('data', 'business_projections.csv')
try:
    business_projections = pd.read_csv(DATA_FILE)
except Exception as e:
    print(f"Error reading CSV file: {e}")
    business_projections = pd.DataFrame()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/business-projections')
def api_business_projections():
    if business_projections.empty:
        return jsonify({"error": "No data available"}), 500

    data = {
        'years': business_projections['Year'].tolist(),
        'earth_units_sold': business_projections['Earth_Units_Sold'].tolist(),
        'space_units_sold': business_projections['Space_Units_Sold'].tolist(),
        'system_sales_earth': business_projections['System_Sales_Earth'].tolist(),
        'system_sales_space': business_projections['System_Sales_Space'].tolist(),
        'maintenance_contracts_earth': business_projections['Maintenance_Contracts_Earth'].tolist(),
        'maintenance_contracts_space': business_projections['Maintenance_Contracts_Space'].tolist(),
        'data_analytics_earth': business_projections['Data_Analytics_Earth'].tolist(),
        'data_analytics_space': business_projections['Data_Analytics_Space'].tolist(),
        'total_revenue': business_projections['Total_Revenue'].tolist(),
        'global_market_size': business_projections['Global_Market_Size'].tolist(),
        'laparis_share_percent': business_projections['LAPARIS_Share_Percent'].tolist()
    }
    return jsonify(data)

if __name__ == '__main__':
    app.run(debug=True)
