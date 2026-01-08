import express from "express";
import {
  getTrending,
  getUpcoming,
  getByProvider,
  getBollywood,
  getAnime,
  getDetails,
  getCredits,
  getVideos,
  getRecommendations,
  getSearch,
  getMovieGenres,
  getTVGenres,
  getByGenre,
  getCollection,
  discoverMovie,
  discoverTV
} from "../controllers/tmdb.controller.js";

const router = express.Router();

router.get("/trending", getTrending);
router.get("/upcoming", getUpcoming);
router.get("/provider/:id", getByProvider);
router.get("/bollywood", getBollywood);
router.get("/anime", getAnime);
router.get("/search", getSearch);

// Genres
router.get("/genres/movie", getMovieGenres);
router.get("/genres/tv", getTVGenres);
router.get("/genre/:type/:id", getByGenre);

// Discover
router.get("/discover/movie", discoverMovie);
router.get("/discover/tv", discoverTV);

// Details
router.get("/details/:type/:id", getDetails);
router.get("/details/:type/:id/credits", getCredits);
router.get("/details/:type/:id/videos", getVideos);
router.get("/details/:type/:id/recommendations", getRecommendations);

// Franchise / Collection
router.get("/collection/:id", getCollection);

export default router;
