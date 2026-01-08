import express from "express";
import protect from "../middlewares/auth.middleware.js";
import {
  addComment,
  getCommentsByPost,
} from "../controllers/comment.controller.js";

const router = express.Router();

router.get("/:postId", getCommentsByPost);
router.post("/:postId", protect, addComment);

export default router;
