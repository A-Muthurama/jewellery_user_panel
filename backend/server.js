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
