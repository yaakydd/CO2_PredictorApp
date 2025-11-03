from flask import Flask, request, jsonify
import joblib
import numpy as np
import pandas as pd

# Initialize Flask app
app = Flask(__name__)

# Load the saved model, encoder, and scaler
model = joblib.load("models/model.pkl")
encoder = joblib.load("models/encoder.pkl")
scaler = joblib.load("models/scaler.pkl")

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the CO₂ Emission Prediction API!"})

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()

    try:
        engine_size = float(data['engine_size'])
        cylinders = int(data['cylinders'])
        fuel_type = data['fuel_type']

        # Prepare dataframe
        X_input = pd.DataFrame([[engine_size, cylinders, fuel_type]], columns=['engine_size(l)', 'cylinders', 'fuel_type'])

        # Encode categorical column
        encoded = encoder.transform(X_input[['fuel_type']])
        encoded_df = pd.DataFrame(encoded, columns=encoder.get_feature_names_out(['fuel_type']))

        # Merge with numerical columns
        X_processed = pd.concat([X_input.drop(columns=['fuel_type']), encoded_df], axis=1)

        # Scale numeric columns
        X_scaled = scaler.transform(X_processed)

        # Predict log-transformed target
        prediction_log = model.predict(X_scaled)

        # Reverse log-transform
        predicted_co2 = np.exp(prediction_log)[0]

        return jsonify({'predicted_co2_emissions': round(predicted_co2, 2)})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    app.run(debug=True)
