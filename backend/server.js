import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from backend directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.join(__dirname, ".env");
console.log("Loading .env from:", envPath);
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error(".env loading error:", result.error.message);
} else {
  console.log(".env loaded successfully. Variables count:", Object.keys(result.parsed || {}).length);
  console.log("DATABASE_URL from server.js:", process.env.DATABASE_URL ? "EXISTS" : "MISSING");
}

import rateLimit from "express-rate-limit";
import app from "./src/app.js";

/* ---------------- RATE LIMITER ---------------- */

const metalLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 20 minutes
  max: 100, // Allow polling
  message: {
    message: "Too many requests from this IP, please try again later."
  }
});

/* APPLY LIMITER ONLY TO METAL PRICE API */
app.use("/api/metal-prices", metalLimiter);

/* ---------------- SERVER ---------------- */

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
