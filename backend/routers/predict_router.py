from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import joblib
import numpy as np
import os

router = APIRouter(prefix="/predict", tags=["Prediction"])

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "model")

try:
    model = joblib.load(os.path.join(MODEL_DIR, "xgboost_model.pkl"))
    encoder = joblib.load(os.path.join(MODEL_DIR, "encoder.pkl"))
    scaler = joblib.load(os.path.join(MODEL_DIR, "scaler.pkl"))
except Exception as e:
    # raise at import time so deployment fails fast if files missing
    raise RuntimeError(f"Model files not found or failed to load: {e}")

class EmissionInput(BaseModel):
    fuel_type: str
    cylinders: int
    engine_size: float

@router.post("/")
async def predict(data: EmissionInput):
    try:
        # encode categorical: encoder expects 2D array
        encoded = encoder.transform([[data.fuel_type]])
        # scale numeric
        X_num = np.array([[data.engine_size, data.cylinders]])
        X_scaled = scaler.transform(X_num)
        # combine columns (order must match training)
        X_final = np.concatenate([X_scaled, encoded], axis=1)
        # predict (model expects 2D)
        pred = model.predict(X_final)[0]
        # if you trained on log(target) reverse transform
        try:
            predicted = float(np.exp(pred))
        except:
            predicted = float(pred)
        return {"predicted_CO2": round(predicted, 2)}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
