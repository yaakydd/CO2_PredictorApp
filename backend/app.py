from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.predict_router import router as predict_router

app = FastAPI(title="CO2 Emission Predictor API")

# Allow frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # during development; restrict later
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include the prediction router
app.include_router(predict_router)

@app.get("/")
def root():
    return {"message": "Welcome to the CO2 Emission Prediction API!"}
