// frontend/src/api.js
import axios from "axios";

// Using Vite proxy to avoid CORS issues
const API = axios.create({
  baseURL: "/api", // This will be proxied to http://127.0.0.1:8000
  timeout: 15000,
});

// --- Sentiment ---
export async function getMeta() {
  const { data } = await API.get("/");
  // prefer aspect range if needed, but keep existing behavior
  return data?.date_range || null;
}

export async function getSummary(start, end) {
  const { data } = await API.get("/sentiment/summary", { params: { start, end } });
  return data;
}

export async function getTrend(start, end) {
  const { data } = await API.get("/sentiment/trend", { params: { start, end } });
  return data;
}

// --- Aspects ---
export async function getAspectSummary(start, end, asPercent = false) {
  const { data } = await API.get("/aspects/summary", {
    params: { start, end, as_percent: asPercent },
  });
  return data;
}

export async function getAspectAvgScores(start, end) {
  const { data } = await API.get("/aspects/avg-scores", { params: { start, end } });
  return data;
}

// --- Aspect × Sentiment (Stacked Bar) ---
export async function getAspectSentimentSplit(start, end, asPercent = false) {
  const { data } = await API.get("/aspects/sentiment-split", {
    params: { start, end, as_percent: asPercent },
  });
  return data;
}
