import Review from "../models/Review.model.js";

// CREATE or UPDATE rating + review
export const upsertReview = async (req, res, next) => {
  try {
    const { tmdbId, mediaType, rating, review } = req.body;

    if (!tmdbId || !mediaType || !rating) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const doc = await Review.findOneAndUpdate(
      {
        user: req.user._id,
        tmdbId,
        mediaType,
      },
      {
        rating,
        review,
      },
      {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      }
    );

    res.status(200).json({
      success: true,
      doc,
    });
  } catch (error) {
    next(error);
  }
};

// GET all reviews for a title
export const getReviewsByTitle = async (req, res, next) => {
  try {
    const { tmdbId, mediaType } = req.params;

    const reviews = await Review.find({ tmdbId, mediaType })
      .populate("user", "username avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};

// GET rating  
export const getRatingStats = async (req, res, next) => {
  try {
    const { tmdbId, mediaType } = req.params;

    const stats = await Review.aggregate([
      { $match: { tmdbId: Number(tmdbId), mediaType } },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    // Normalize to 4 bars
    const result = { 1: 0, 2: 0, 3: 0, 4: 0 };
    stats.forEach((s) => {
      result[s._id] = s.count;
    });

    res.status(200).json({
      success: true,
      ratings: result,
    });
  } catch (error) {
    next(error);
  }
};
