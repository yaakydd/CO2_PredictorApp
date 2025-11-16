import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Spinner from "./Spinner";
import ResultCard from "./AnimationCard";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function PredictionForm() {
  const [form, setForm] = useState({
    fuel_type: "",
    cylinders: "",
    engine_size: ""
  });
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setPrediction(null);

    try {
      const payload = {
        fuel_type: form.fuel_type,
        cylinders: parseInt(form.cylinders, 10),
        engine_size: parseFloat(form.engine_size)
      };

      const res = await fetch(`${API_URL}/api/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.detail || "Prediction failed");
      }

      const data = await res.json();
      
      // Simulate spinner showing for at least 1.5 seconds for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setPrediction(data);
      toast.success("Prediction successful!");
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Prediction failed. Check your inputs.");
      setLoading(false);
    } finally {
      // Don't set loading to false here, let it stay true until animation completes
      if (!prediction) {
        setLoading(false);
      }
    }
  }

  function handleReset() {
    setPrediction(null);
    setLoading(false);
    setForm({
      fuel_type: "",
      cylinders: "",
      engine_size: ""
    });
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Animated Carbon Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-green-400/20"
            style={{
              width: Math.random() * 4 + 2,
              height: Math.random() * 4 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{
              y: [0, -100, 0],
              opacity: [0.2, 0.6, 0.2],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 3 + Math.random() * 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <AnimatePresence mode="wait">
          {loading ? (
            // STEP 2: Show Spinner (form disappears)
            <motion.div
              key="spinner"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <Spinner />
            </motion.div>
          ) : prediction ? (
            // STEP 3: Show Result Card (spinner disappears)
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.5 }}
              className="w-full max-w-2xl"
            >
              <ResultCard prediction={prediction} onReset={handleReset} />
            </motion.div>
          ) : (
            // STEP 1: Show Form (initial state)
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-md"
            >
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20">
                <div className="text-center mb-6">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="inline-block mb-4"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                      <span className="text-4xl">🌍</span>
                    </div>
                  </motion.div>
                  <h1 className="text-3xl font-bold text-white mb-2">
                    CO₂ Emissions Predictor
                  </h1>
                  <p className="text-gray-300 text-sm">
                    Estimate your vehicle's carbon footprint
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      🔋 Fuel Type
                    </label>
                    <select
                      name="fuel_type"
                      value={form.fuel_type}
                      onChange={handleChange}
                      required
                      className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    >
                      <option value="" className="text-gray-900">Choose fuel type</option>
                      <option value="X" className="text-gray-900">X - Regular Gasoline</option>
                      <option value="Z" className="text-gray-900">Z - Premium Gasoline</option>
                      <option value="E" className="text-gray-900">E - Ethanol (E85)</option>
                      <option value="D" className="text-gray-900">D - Diesel</option>
                      <option value="N" className="text-gray-900">N - Natural Gas</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      ⚙️ Number of Cylinders
                    </label>
                    <input
                      name="cylinders"
                      value={form.cylinders}
                      onChange={handleChange}
                      required
                      type="number"
                      min="2"
                      max="16"
                      className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="e.g., 4"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      🚗 Engine Size (Liters)
                    </label>
                    <input
                      name="engine_size"
                      value={form.engine_size}
                      onChange={handleChange}
                      required
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="10"
                      className="w-full p-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      placeholder="e.g., 2.0"
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-green-500/50 transition-all mt-6"
                  >
                    Predict CO₂ Emissions
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
