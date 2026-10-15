import express from "express";
import {
  getStores,
  getStoreFilters,
  getStoreBySlugOrId,
  createClaimRequest,
  createReportRequest,
} from "../controllers/stores.controller.js";

const router = express.Router();

// Public stores routes
router.get("/stores", getStores);
router.get("/stores/meta/filters", getStoreFilters);
router.get("/stores/:slugOrId", getStoreBySlugOrId);
router.post("/stores/:id/claim", createClaimRequest);
router.post("/stores/:id/report", createReportRequest);

export default router;
