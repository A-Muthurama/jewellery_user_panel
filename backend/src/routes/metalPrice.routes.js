import express from "express";
import { getMetalPrices, streamMetalPrices, refreshMetalPrices } from "../controllers/metalPrice.controller.js";

const router = express.Router();

// Single, stable endpoint
router.get("/", getMetalPrices);

// SSE Stream
router.get("/stream", streamMetalPrices);

// Force refresh
router.post("/refresh", refreshMetalPrices);

export default router;
