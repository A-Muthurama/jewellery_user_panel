import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import newsRoutes from "./routes/news.routes.js";
import metalPriceRoutes from "./routes/metalPrice.routes.js";
import { startPoller } from "./services/metalPoller.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// start poller with interval configurable via METAL_POLL_MS env var (default 30s)
startPoller(process.env.METAL_POLL_MS ? Number(process.env.METAL_POLL_MS) : 30 * 1000);

// ---------------- API ROUTES ----------------
app.use("/api/news", newsRoutes);
app.use("/api/metal-prices", metalPriceRoutes);

// ---------------- SERVE FRONTEND ----------------
const frontendPath = path.join(__dirname, "../frontend/dist");
app.use(express.static(frontendPath));

// Catch-all route to serve React for all non-API requests (SPA routing)
app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});

export default app;
