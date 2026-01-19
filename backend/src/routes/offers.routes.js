import express from "express";
import {
  getOffers,
  getAllOffers,
  getOfferById,
  toggleLike,
  createOffer,
  updateOffer,
  deleteOffer
} from "../controllers/offers.controller.js";

const router = express.Router();

// Public routes (Requirement: /api/public/offers)
// NOTE: This will be mapped to /api/public in app.js
router.get("/offers", getOffers);
router.get("/offers/:id", getOfferById);
router.put("/offers/:id/like", toggleLike);

// Admin routes (All offers, status management)
router.get("/admin/all", getAllOffers);

// Admin / Vendor internal routes
router.post("/offers", createOffer);
router.put("/offers/:id", updateOffer);
router.delete("/offers/:id", deleteOffer);

export default router;
