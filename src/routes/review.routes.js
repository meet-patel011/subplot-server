import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  upsertReview,
  getReviewsByTitle,
  getRatingStats,
} from "../controllers/review.controller.js";

const router = express.Router();

router.post("/", protect, upsertReview);
router.get("/:mediaType/:tmdbId", getReviewsByTitle);
router.get("/ratings/:mediaType/:tmdbId", getRatingStats);

export default router;
