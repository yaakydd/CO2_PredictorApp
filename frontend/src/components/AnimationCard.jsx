import React from "react";
import { motion } from "framer-motion";

export default function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-5 bg-green-50 border-l-4 border-green-500 p-4 rounded-md text-center text-green-800 font-semibold"
    >
      {children}
    </motion.div>
  );
}
