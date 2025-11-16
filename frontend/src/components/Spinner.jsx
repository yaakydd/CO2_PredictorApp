import React from "react";
import { motion } from "framer-motion";

export default function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center">
      <motion.div
        className="relative w-24 h-24"
      >
        {/* Outer ring */}
        <motion.div
          className="absolute inset-0 border-4 border-green-400/30 rounded-full"
        />
        
        {/* Spinning ring */}
        <motion.div
          className="absolute inset-0 border-4 border-green-400 border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        />
        
        {/* Center icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl">🌍</span>
        </div>
      </motion.div>
      
      <motion.div
        className="mt-6 text-center"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <p className="text-white text-xl font-semibold">Analyzing emissions...</p>
        <p className="text-gray-300 text-sm mt-2">Processing your vehicle data</p>
      </motion.div>
    </div>
  );
}