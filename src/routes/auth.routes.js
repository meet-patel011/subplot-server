import express from "express";
import {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  getMe,
} from "../controllers/auth.controller.js";

import protect from "../middlewares/auth.middleware.js";

const router = express.Router();

// Auth routes
router.get("/me", protect, getMe);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshAccessToken);
router.post("/logout", logoutUser);

export default router;
