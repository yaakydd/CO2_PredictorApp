import React from "react";
import { motion } from "framer-motion";
import PredictionForm from "./components/PredictionForm";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-md"
      >
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">
          🚗 CO₂ Emission Predictor
        </h1>
        <PredictionForm />
      </motion.div>
    </div>
  );
};

export default App;
