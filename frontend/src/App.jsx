import React from "react";
import PredictionForm from "./components/PredictionForm";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="bg-white rounded-3xl shadow-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-4">
          CO₂ Emission Predictor
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Enter engine size, cylinders and fuel type to estimate CO₂ (g/km)
        </p>
        <PredictionForm />
      </div>
    </div>
  );
}
