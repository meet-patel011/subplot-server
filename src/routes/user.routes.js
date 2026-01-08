import express from "express";
import { getUserProfile } from "../controllers/user.controller.js";
import protect from "../middlewares/auth.middleware.js";
import User from "../models/user.model.js";

const router = express.Router();

//User routes
router.get("/profile", protect, getUserProfile);

// Update avatar
router.put("/avatar", protect, async (req, res) => {
  try {
    const { avatar } = req.body;

    if (!avatar) {
      return res.status(400).json({
        success: false,
        message: "Avatar data required"
      });
    }

    await User.findByIdAndUpdate(req.user._id, { avatar });

    res.json({
      success: true,
      message: "Avatar updated successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update avatar"
    });
  }
});

export default router;
