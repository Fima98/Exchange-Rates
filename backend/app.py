from flask import Flask, jsonify, request, render_template
from dotenv import load_dotenv
import os
import requests

load_dotenv()

app = Flask(__name__, static_folder='../frontend/static', template_folder='../frontend')

API_KEY = os.getenv('KEY')
API_URL = f'https://api.exchangeratesapi.io/v1/latest?access_key={API_KEY}'

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/convert', methods=['POST'])
def convert():
    amount = float(request.form.get('amount'))
    from_currency = request.form.get('from_currency').upper()
    to_currency = request.form.get('to_currency').upper()
    
    try:
        response = requests.get(API_URL)
        response.raise_for_status()
        data = response.json()

        rates = data.get('rates', {})
        if from_currency not in rates or to_currency not in rates:
            return jsonify({'error': 'Invalid currency code'}), 400
        
        from_rate = rates[from_currency]
        to_rate = rates[to_currency]
        converted_amount = (amount / from_rate) * to_rate
        
        result = {
            'amount': amount,
            'from_currency': from_currency,
            'to_currency': to_currency,
            'from_rate': from_rate,
            'to_rate': to_rate,
            'converted_amount': round(converted_amount, 2)
        }

        return jsonify(result)
    except requests.exceptions.RequestException as e:
        return jsonify({'error': str(e)}), 500
    except ValueError:
        return jsonify({'error': 'Invalid amount'}), 400

if __name__ == '__main__':
    app.run(port=8000, debug=True)
