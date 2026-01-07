import express from "express";
import { getTrendingNews } from "../controllers/news.controller.js";

const router = express.Router();

router.get("/", getTrendingNews);

export default router;
