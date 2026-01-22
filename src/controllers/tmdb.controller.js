import * as tmdbService from "../services/tmdb.service.js";

export const getTrending = async (req, res, next) => {
  try {
    res.json(await tmdbService.trending());
  } catch (e) { next(e); }
};

export const getUpcoming = async (req, res, next) => {
  try {
    res.json(await tmdbService.upcoming());
  } catch (e) { next(e); }
};

export const getByProvider = async (req, res, next) => {
  try {
    res.json(await tmdbService.byProvider(req.params.id));
  } catch (e) { next(e); }
};

export const getBollywood = async (req, res, next) => {
  try {
    res.json(await tmdbService.bollywood());
  } catch (e) { next(e); }
};

export const getAnime = async (req, res, next) => {
  try {
    res.json(await tmdbService.anime());
  } catch (e) { next(e); }
};

export const getDetails = async (req, res, next) => {
  try {
    res.json(await tmdbService.details(req.params.type, req.params.id));
  } catch (e) { next(e); }
};

export const getCredits = async (req, res, next) => {
  try {
    res.json(await tmdbService.credits(req.params.type, req.params.id));
  } catch (e) { next(e); }
};

export const getVideos = async (req, res, next) => {
  try {
    res.json(await tmdbService.videos(req.params.type, req.params.id));
  } catch (e) { next(e); }
};

export const getRecommendations = async (req, res, next) => {
  try {
    res.json(await tmdbService.recommendations(req.params.type, req.params.id));
  } catch (e) { next(e); }
};

export const getSearch = async (req, res, next) => {
  try {
    res.json(await tmdbService.search(req.query.q));
  } catch (e) { next(e); }
};

export const getMovieGenres = async (req, res, next) => {
  try {
    res.json(await tmdbService.movieGenres());
  } catch (e) { next(e); }
};

export const getTVGenres = async (req, res, next) => {
  try {
    res.json(await tmdbService.tvGenres());
  } catch (e) { next(e); }
};

export const getByGenre = async (req, res, next) => {
  try {
    res.json(await tmdbService.byGenre(req.params.type, req.params.id));
  } catch (e) { next(e); }
};

export const getCollection = async (req, res, next) => {
  try {
    res.json(await tmdbService.collection(req.params.id));
  } catch (e) { next(e); }
};

export const discoverMovie = async (req, res, next) => {
  try {
    res.json(await tmdbService.discoverMovie(req.query));
  } catch (e) { next(e); }
};

export const discoverTV = async (req, res, next) => {
  try {
    res.json(await tmdbService.discoverTV(req.query));
  } catch (e) { next(e); }
};




