// dotenv already loaded in server.js
// import dotenv from "dotenv";
// dotenv.config();

import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import newsRoutes from "./routes/news.routes.js";
import metalPriceRoutes from "./routes/metalPrice.routes.js";
import offersRoutes from "./routes/offers.routes.js";
import { startPoller } from "./services/metalPoller.js";
import { initializeDatabase } from "./utils/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('trust proxy', 1);
app.use(cors());
app.use(express.json());

// Initialize database on startup (non-blocking)
initializeDatabase().catch(err => {
  console.error("Database initialization failed:", err.message);
  console.log("Server continuing without database...");
});

// Start metal poller
startPoller(process.env.METAL_POLL_MS ? Number(process.env.METAL_POLL_MS) : 30 * 1000);

// ---------------- API ROUTES ----------------
app.use("/api/news", newsRoutes);
app.use("/api/metal-prices", metalPriceRoutes);
app.use("/api/public", offersRoutes); // Fulfills GET /api/public/offers requirement

// Root route for API status
app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "Jewellers Paradise API is running",
    endpoints: {
      news: "/api/news",
      metalPrices: "/api/metal-prices",
      offers: "/api/public/offers"
    }
  });
});

// ---------------- SERVE FRONTEND (Optional) ----------------
const frontendPath = path.join(__dirname, "../../frontend/dist");
// Check if frontend exists before serving to avoid 404s on API-only deployments
app.use(express.static(frontendPath));

// Catch-all: send React frontend for all non-API routes if index.html exists
app.get("*", (req, res) => {
  // Use res.sendFile with an error fallback
  const indexPath = path.join(frontendPath, "index.html");
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).json({
        status: "error",
        message: "Route not found or frontend not deployed on this server"
      });
    }
  });
});

export default app;
