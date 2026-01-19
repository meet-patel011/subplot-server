import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
  getPosterFallback,
} from "../controllers/watchlist.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();


// Watchlist routes
router.post("/", protect, addToWatchlist);
router.get("/", protect, getWatchlist);
router.delete("/:mediaType/:tmdbId", protect, removeFromWatchlist);
router.get("/:mediaType/:tmdbId/poster", protect, getPosterFallback);


export default router;
