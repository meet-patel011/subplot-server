import express from "express";
import {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist,
} from "../controllers/watchlist.controller.js";
import protect from "../middlewares/auth.middleware.js";

const router = express.Router();


// Watchlist routes
router.post("/", protect, addToWatchlist);
router.get("/", protect, getWatchlist);
router.delete("/:mediaType/:tmdbId", protect, removeFromWatchlist);


export default router;
