import express from "express";
import cors from "cors";
import newsRoutes from "./routes/news.routes.js";
import metalPriceRoutes from "./routes/metalPrice.routes.js";
import { startPoller } from "./services/metalPoller.js";

const app = express();

app.use(cors());

// start poller with interval configurable via METAL_POLL_MS env var (default 30s)
startPoller(process.env.METAL_POLL_MS ? Number(process.env.METAL_POLL_MS) : 30 * 1000);

app.use(express.json());

app.use("/api/news", newsRoutes);
app.use("/api/metal-prices", metalPriceRoutes);

app.get("/", (req, res) => {
  res.send("News API Backend Running");
});

export default app;
