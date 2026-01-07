import EventEmitter from "events";
import { fetchMetalRates } from "./metalPrice.service.js";

const emitter = new EventEmitter();

// Internal state
let currentData = null;
let lastFetch = 0;
let isFetching = false;

const TROY_OUNCE_IN_GRAMS = 31.1035;
const GOLD_ADJUSTMENT = 0.58;
const SILVER_ADJUSTMENT = 0.42;
const PLATINUM_ADJUSTMENT = 0.52;

const normalizeRates = (rates) => {
  // Safe validation
  if (!rates || !rates.XAU || !rates.INR) {
    console.error("MetalPoller: Invalid rates data", rates);
    throw new Error("Invalid rates data");
  }

  // Calculate USD prices (1 USD = x Metal) -> (1 Metal = 1/x USD)
  const usdXau = 1 / rates.XAU;
  const usdXag = 1 / rates.XAG;
  const usdXpt = 1 / rates.XPT;

  // Convert to INR (1 Metal in USD * INR Rate)
  const inrXau = usdXau * rates.INR;
  const inrXag = usdXag * rates.INR;
  const inrXpt = usdXpt * rates.INR;

  // Per Gram
  const goldPerGram = inrXau / TROY_OUNCE_IN_GRAMS;
  const silverPerGram = inrXag / TROY_OUNCE_IN_GRAMS;
  const platinumPerGram = inrXpt / TROY_OUNCE_IN_GRAMS;

  // Market Adjustments (Import Duty + GST ~15% for Gold)
  // Gold 24K
  const gold24k = Math.round(goldPerGram * 1.15);
  // Gold 22K (Standard 916)
  const gold22k = Math.round(gold24k * 0.916);

  // Silver (Spot + ~12% premium/duty)
  const silver = Number((silverPerGram * 1.12).toFixed(2));

  // Platinum (Spot + ~12%)
  const platinum = Math.round(platinumPerGram * 1.12);

  return {
    gold: { price22k: gold22k, price24k: gold24k, trend: "stable" },
    silver: { price: silver, trend: "stable" },
    platinum: { price: platinum, trend: "stable" },
    updatedAt: new Date().toISOString(),
    isFallback: false
  };
};

export const getCurrentData = () => currentData;

export const forceFetch = async () => {
  // Avoid parallel fetches
  if (isFetching) return currentData;
  try {
    isFetching = true;
    const rates = await fetchMetalRates();
    currentData = normalizeRates(rates);
    lastFetch = Date.now();
    emitter.emit("update", currentData);
    console.log("MetalPoller: fetched fresh data at", new Date(lastFetch).toISOString());
    return currentData;
  } catch (err) {
    console.error("MetalPoller fetch failed:", err.message);
    // Keep existing data if available, otherwise fallback
    if (!currentData) {
      currentData = {
        gold: { price22k: 6750, price24k: 7360, trend: "up" },
        silver: { price: 88.5, trend: "stable" },
        platinum: { price: 3200, trend: "stable" },
        updatedAt: new Date().toISOString(),
        isFallback: true
      };
      emitter.emit("update", currentData);
    }
    return currentData;
  } finally {
    isFetching = false;
  }
};

export const startPoller = (intervalMs = 30 * 1000) => {
  // Initial fetch
  forceFetch();
  setInterval(() => {
    forceFetch();
  }, intervalMs);
  console.log(`MetalPoller started; polling every ${intervalMs} ms`);
};

export default emitter;