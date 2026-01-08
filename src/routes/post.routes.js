import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  createPost,
  getAllPosts,
  toggleLike,
} from "../controllers/post.controller.js";

const router = express.Router();

// Public feed
router.get("/", getAllPosts);

// Create post
router.post("/", protect, createPost);

router.post("/:id/like", protect, toggleLike);

export default router;
