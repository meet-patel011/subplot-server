import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    tmdbId: {
      type: Number,
      required: true,
    },

    mediaType: {
      type: String,
      enum: ["movie", "tv"],
      required: true,
    },

    rating: {
      type: Number,
      min: 1,
      max: 4,
      required: true,
    },

    review: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// one review per user per title
reviewSchema.index({ user: 1, tmdbId: 1, mediaType: 1 }, { unique: true });

const Review =
  mongoose.models.Review ||
  mongoose.model("Review", reviewSchema);

export default Review;

