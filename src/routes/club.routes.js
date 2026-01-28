import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  getClubPosts,
  createClubPost,
  likePost
} from "../controllers/club.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/:club", getClubPosts);

/* PROTECTED */
router.post("/:club", protect, createClubPost);

router.post("/:club/like/:postId", likePost);

export default router;
