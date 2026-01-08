import mongoose from "mongoose";

const watchlistSchema = new mongoose.Schema(
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

    title: {
      type: String,
      required: true,
    },

    poster: {
      type: String,
    },
  },
  { timestamps: true }
);

const Watchlist =
  mongoose.models.Watchlist ||
  mongoose.model("Watchlist", watchlistSchema);

export default Watchlist;

