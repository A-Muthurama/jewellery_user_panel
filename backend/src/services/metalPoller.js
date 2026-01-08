import EventEmitter from "events";
import { fetchMetalRates } from "./metalPrice.service.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CACHE_FILE = path.join(__dirname, "../../metal-cache.json");

const emitter = new EventEmitter();

// Internal state
let currentData = null;
let lastFetch = 0;
let isFetching = false;

// Default cache duration: 19 hours (as per user request)
const CACHE_DURATION_MS = (process.env.CACHE_DURATION_HOURS ? Number(process.env.CACHE_DURATION_HOURS) : 24) * 60 * 60 * 1000;

const TROY_OUNCE_IN_GRAMS = 31.1035;

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

const saveToCache = (data) => {
  try {
    const cacheData = {
      timestamp: Date.now(),
      data: data
    };
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cacheData, null, 2));
    console.log("MetalPoller: Cache saved to", CACHE_FILE);
  } catch (err) {
    console.error("MetalPoller: Failed to save cache:", err.message);
  }
};

const loadFromCache = () => {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const raw = fs.readFileSync(CACHE_FILE, "utf-8");
      const cache = JSON.parse(raw);
      console.log("MetalPoller: Cache loaded, last updated:", new Date(cache.timestamp).toISOString());
      return cache;
    }
  } catch (err) {
    console.error("MetalPoller: Failed to load cache:", err.message);
  }
  return null;
};

export const getCurrentData = () => currentData;

export const forceFetch = async (ignoreCache = false) => {
  // Avoid parallel fetches
  if (isFetching) return currentData;

  // Check if current data is fresh enough
  if (!ignoreCache && currentData && (Date.now() - lastFetch < CACHE_DURATION_MS)) {
    console.log("MetalPoller: Using existing data (still fresh)");
    return currentData;
  }

  try {
    isFetching = true;
    console.log("MetalPoller: Fetching fresh rates from API...");
    const rates = await fetchMetalRates();
    currentData = normalizeRates(rates);
    lastFetch = Date.now();

    saveToCache(currentData);

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
  // Try to load from cache first
  const cache = loadFromCache();
  if (cache) {
    currentData = cache.data;
    lastFetch = cache.timestamp;
    console.log("MetalPoller: Initialized from cache");

    // Check if cache is already expired
    if (Date.now() - lastFetch >= CACHE_DURATION_MS) {
      console.log("MetalPoller: Cached data is expired, triggering refresh...");
      forceFetch();
    }
  } else {
    // Initial fetch if no cache
    forceFetch();
  }

  // Use a longer interval for polling if we are caching for 10-20 hours
  // Usually, polling every hour is enough if we check the timestamp in forceFetch
  const pollInterval = Math.min(intervalMs, 60 * 60 * 1000); // Max 1 hour poll check

  setInterval(() => {
    forceFetch();
  }, pollInterval);

  console.log(`MetalPoller started; checking every ${pollInterval} ms (Cache duration: ${CACHE_DURATION_MS / (60 * 60 * 1000)} hours)`);
};

export default emitter;
