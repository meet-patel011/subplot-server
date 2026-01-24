import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  getClubPosts,
  createClubPost
} from "../controllers/club.controller.js";

const router = express.Router();

/* PUBLIC */
router.get("/:club", getClubPosts);

/* PROTECTED */
router.post("/:club", protect, createClubPost);

export default router;
