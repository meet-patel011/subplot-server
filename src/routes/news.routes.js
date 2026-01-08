import express from "express";
import { getLatestNews } from "../controllers/news.controller.js";

const router = express.Router();

// endpoint
router.get("/top", getLatestNews);

export default router;
