from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Literal
import joblib
import numpy as np
import pandas as pd
import os

# Create the router instance
predict_router = APIRouter()

# Load model, encoder, and scaler
model = None
encoder = None
scaler = None

model_path = "models/xgboost_model.pkl"
encoder_path = "models/encoder.pkl"
scaler_path = "models/scaler.pkl"

try:
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f" Model loaded successfully")
    else:
        print(f" Model file not found at {model_path}")
except Exception as e:
    print(f" Could not load model: {e}")

try:
    if os.path.exists(encoder_path):
        encoder = joblib.load(encoder_path)
        print(f" Encoder loaded successfully")
    else:
        print(f" Encoder file not found at {encoder_path}")
except Exception as e:
    print(f" Could not load encoder: {e}")

try:
    if os.path.exists(scaler_path):
        scaler = joblib.load(scaler_path)
        print(f" Scaler loaded successfully")
    else:
        print(f" Scaler file not found at {scaler_path}")
except Exception as e:
    print(f" Could not load scaler: {e}")

# Define input schema
class PredictionInput(BaseModel):
    fuel_type: Literal["X", "Z", "E", "D", "N"]
    engine_size: float
    cylinders: int
    
    class Config:
        json_schema_extra = {
            "example": {
                "fuel_type": "X",
                "engine_size": 2.0,
                "cylinders": 4
            }
        }

class PredictionOutput(BaseModel):
    predicted_co2_emissions: float
    unit: str = "g/km"
    interpretation: str
    category: str

def preprocess_input(fuel_type: str, engine_size: float, cylinders: int):
    """
    Apply the EXACT same preprocessing as in training:
    1. Create DataFrame
    2. One-hot encode fuel_type
    3. Combine numerical + encoded
    4. Scale everything
    """
    # Create input dataframe
    df = pd.DataFrame([{
        "fuel_type": fuel_type,
        "engine_size": engine_size,
        "cylinders": cylinders
    }])
    
    # One-hot encode categorical (EXACT same as training)
    cat_encoded = encoder.transform(df[["fuel_type"]])
    cat_encoded_df = pd.DataFrame(
        cat_encoded,
        columns=encoder.get_feature_names_out(["fuel_type"])
    )
    
    # Combine numerical + encoded categorical
    num_df = df[["engine_size", "cylinders"]]
    combined = pd.concat([num_df, cat_encoded_df], axis=1)
    
    # Scale numeric + encoded features (EXACT same as training)
    scaled_input = scaler.transform(combined)
    
    return scaled_input

def interpret_emissions(co2_value: float) -> tuple:
    """
    Interpret the CO2 emissions value
    Returns (interpretation_text, category)
    """
    if co2_value < 120:
        return (
            "Excellent! This vehicle has very low emissions and is environmentally friendly.",
            "Excellent"
        )
    elif co2_value < 160:
        return (
            "Good! This vehicle has moderate emissions and is reasonably eco-friendly.",
            "Good"
        )
    elif co2_value < 200:
        return (
            "Average. This vehicle has typical emissions for its class.",
            "Average"
        )
    elif co2_value < 250:
        return (
            "High. This vehicle produces above-average emissions and may have higher fuel costs.",
            "High"
        )
    else:
        return (
            "Very High. This vehicle produces significant emissions and will have high fuel costs.",
            "Very High"
        )

@predict_router.post("/predict", response_model=PredictionOutput)
async def predict_emissions(input_data: PredictionInput):
    """
    Predict CO2 emissions based on vehicle features
    """
    if model is None or encoder is None or scaler is None:
        raise HTTPException(
            status_code=503, 
            detail="Prediction service not fully initialized. Missing model, encoder, or scaler."
        )
    
    try:
        # Preprocess input using EXACT same steps as training
        scaled_features = preprocess_input(
            input_data.fuel_type,
            input_data.engine_size,
            input_data.cylinders
        )
        
        # Make prediction
        prediction = model.predict(scaled_features)[0]
        co2_value = round(float(prediction), 2)
        
        # Get interpretation
        interpretation, category = interpret_emissions(co2_value)
        
        return PredictionOutput(
            predicted_co2_emissions=co2_value,
            interpretation=interpretation,
            category=category
        )
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        raise HTTPException(
            status_code=400, 
            detail=f"Prediction error: {str(e)}"
        )

@predict_router.get("/health")
async def health_check():
    """Check if the prediction service is running"""
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "encoder_loaded": encoder is not None,
        "scaler_loaded": scaler is not None
    }

@predict_router.get("/fuel-types")
async def get_fuel_types():
    """Get available fuel types"""
    return {
        "fuel_types": ["X", "Z", "E", "D", "N"],
        "descriptions": {
            "X": "Regular gasoline",
            "Z": "Premium gasoline", 
            "E": "Ethanol (E85)",
            "D": "Diesel",
            "N": "Natural gas"
        }
    }
