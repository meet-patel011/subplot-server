import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    club: {
      type: String,
      required: true,
      index: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000
    },

    likes: {
      type: Number,
      default: 0
    },
    
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]

  },
  { timestamps: true }
);

export default mongoose.model("Post", postSchema);
