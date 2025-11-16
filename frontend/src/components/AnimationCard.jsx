import React from "react";
import { motion } from "framer-motion";

export default function AnimationCard({ prediction, onReset }) {
  const { predicted_co2_emissions, interpretation, category, color } = prediction;

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center"
      >
        {/* Success Icon */}
        <motion.div
          className="inline-block mb-6"
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 5, -5, 0]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3
          }}
        >
          <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center">
            <span className="text-5xl">✅</span>
          </div>
        </motion.div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Prediction Complete!
        </h2>
        <p className="text-gray-300 text-sm mb-6">
          Here's your vehicle's estimated carbon footprint
        </p>

        {/* Main Result */}
        <motion.div
          className="my-8 p-6 rounded-xl bg-white/5"
          animate={{ 
            boxShadow: [
              `0 0 20px ${color}40`,
              `0 0 40px ${color}60`,
              `0 0 20px ${color}40`
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <div className="text-7xl font-bold mb-2" style={{ color }}>
              {predicted_co2_emissions}
            </div>
            <div className="text-gray-300 text-xl">g/km</div>
          </motion.div>
        </motion.div>

        {/* Category Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="inline-block px-6 py-2 rounded-full mb-6"
          style={{ 
            backgroundColor: `${color}20`,
            border: `2px solid ${color}`
          }}
        >
          <span className="font-semibold text-lg" style={{ color }}>
            {category}
          </span>
        </motion.div>

        {/* Interpretation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-xl mb-6 bg-white/5 border-l-4"
          style={{ borderColor: color }}
        >
          <p className="text-gray-200 text-base leading-relaxed">
            {interpretation}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-green-500/50 transition-all"
          >
            Make Another Prediction
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              const text = `My vehicle's CO2 emissions: ${predicted_co2_emissions} g/km (${category})`;
              navigator.clipboard.writeText(text);
              alert("Copied to clipboard!");
            }}
            className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg font-semibold border border-white/30 transition-all"
          >
            📋 Share Result
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
