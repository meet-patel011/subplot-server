import Watchlist from "../models/Watchlist.model.js";


//add to watchlist
export const addToWatchlist = async (req, res, next) => {
  try {
    const { tmdbId, mediaType, title, poster } = req.body;

    // basic validation
    if (!tmdbId || !mediaType || !title) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    // prevent duplicates
    const exists = await Watchlist.findOne({
      user: req.user._id,
      tmdbId,
      mediaType,
    });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Already in watchlist",
      });
    }

    const item = await Watchlist.create({
      user: req.user._id,
      tmdbId,
      mediaType,
      title,
      poster,
    });

    res.status(201).json({
      success: true,
      message: "Added to watchlist",
      item,
    });
  } catch (error) {
    next(error);
  }
};

//get user watchlist
export const getWatchlist = async (req, res, next) => {
  try {
    const items = await Watchlist.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: items.length,
      items,
    });
  } catch (error) {
    next(error);
  }
};

// remove from watchlist
export const removeFromWatchlist = async (req, res, next) => {
  try {
    const { tmdbId, mediaType } = req.params;

    const deleted = await Watchlist.findOneAndDelete({
      user: req.user._id,
      tmdbId: Number(tmdbId),
      mediaType,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Item not found in watchlist",
      });
    }

    res.status(200).json({
      success: true,
      message: "Removed from watchlist",
    });
  } catch (error) {
    next(error);
  }
};
