import React from "react";
import { motion } from "framer-motion";
import PredictionForm from "./components/PredictionForm";

const App = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-200 p-4">
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg md:max-w-xl"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-indigo-700 mb-6 leading-tight">
          CO₂ Emission Predictor
        </h1>
        <PredictionForm />
      </motion.div>
    </div>
  );
};

export default App;
