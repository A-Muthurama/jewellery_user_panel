import { getCurrentData, forceFetch, default as pollerEmitter } from "../services/metalPoller.js";

// Legacy cache fallback for requests before poller populates
let cache = null;
let lastFetch = 0;
const CACHE_TIME = process.env.METAL_CACHE_MS ? Number(process.env.METAL_CACHE_MS) : 5 * 60 * 1000; // 5 minutes

export const getMetalPrices = async (req, res) => {
  try {
    // If poller has data, serve it (near realtime)
    const pollerData = getCurrentData();
    if (pollerData) return res.json(pollerData);

    // Fall back to legacy fetch/cache behavior while poller warms up
    if (cache && Date.now() - lastFetch < CACHE_TIME) {
      console.log('Serving metal prices from cache. Last fetch:', new Date(lastFetch).toISOString());
      return res.json(cache);
    }

    // No poller data and cache stale -> force a fetch
    const data = await forceFetch();
    cache = data;
    lastFetch = Date.now();
    return res.json(data);
  } catch (err) {
    console.error("METAL PRICE ERROR (Using Fallback):", err.message);
    // Final fallback
    const fallbackData = {
      gold: { price22k: 6750, price24k: 7360, trend: "up" },
      silver: { price: 88.50, trend: "stable" },
      platinum: { price: 3200, trend: "stable" },
      updatedAt: new Date().toISOString(),
      isFallback: true
    };
    return res.json(fallbackData);
  }
};

// SSE stream handler
export const streamMetalPrices = (req, res) => {
  // SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  res.write("retry: 10000\n\n");

  const sendData = (data) => {
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  // send initial state
  const initial = getCurrentData();
  if (initial) sendData(initial);

  // register listener
  const onUpdate = (data) => sendData(data);
  pollerEmitter.on("update", onUpdate);

  req.on("close", () => {
    pollerEmitter.off("update", onUpdate);
  });
};

// Force refresh endpoint
export const refreshMetalPrices = async (req, res) => {
  try {
    const data = await forceFetch();
    return res.json({ success: true, data });
  } catch (err) {
    console.error("Refresh failed:", err.message);
    return res.status(500).json({ success: false, message: "Refresh failed" });
  }
};
