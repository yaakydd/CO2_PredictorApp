import React, { useState } from "react";
import axios from "axios";
import Spinner from "./Spinner";
import AnimatedCard from "./AnimationCard";
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
    toast.dismiss();

    try {
      const payload = {
        fuel_type: form.fuel_type,   // must match training categories X/Z/E/D/N
        cylinders: parseInt(form.cylinders, 10),
        engine_size: parseFloat(form.engine_size)
      };

      const res = await axios.post(`${API_URL}/predict/`, payload);

      const val =
        res.data.predicted_CO2 ??
        res.data.predicted_co2 ??
        res.data.co2_emissions ??
        res.data.predicted_CO2_Emission;

      if (val === undefined) throw new Error("Backend returned unexpected response");

      setPrediction(Number(val).toFixed(2));
      toast.success("Prediction successful!");
    } catch (err) {
      console.error(err);
      toast.error("Prediction failed — check backend or inputs.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      
      <label className="text-sm font-medium">Fuel Type</label>
      <select
        name="fuel_type"
        value={form.fuel_type}
        onChange={handleChange}
        required
        className="p-2 border rounded"
      >
        <option value="">Choose fuel type</option>
        <option value="X">X</option>
        <option value="Z">Z</option>
        <option value="E">E</option>
        <option value="D">D</option>
        <option value="N">N</option>
      </select>

      <label className="text-sm font-medium">Cylinders</label>
      <input
        name="cylinders"
        value={form.cylinders}
        onChange={handleChange}
        required
        type="number"
        className="p-2 border rounded"
        placeholder="4"
      />

      <label className="text-sm font-medium">Engine Size (L)</label>
      <input
        name="engine_size"
        value={form.engine_size}
        onChange={handleChange}
        required
        type="number"
        step="0.1"
        className="p-2 border rounded"
        placeholder="2.0"
      />

      <button
        disabled={loading}
        type="submit"
        className="mt-2 bg-indigo-600 text-white py-2 rounded font-semibold hover:bg-indigo-700"
      >
        {loading ? "Predicting..." : "Predict CO₂ Emission"}
      </button>

      {loading && <Spinner />}

      {prediction && (
        <AnimatedCard>
          Estimated CO₂ Emission:
          <span className="text-green-700 font-bold"> {prediction} g/km</span>
        </AnimatedCard>
      )}
    </form>
  );
}
