import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/featured-trailers", (req, res) => {
  try {
    const filePath = path.resolve("data/featuredTrailers.json");
    const data = fs.readFileSync(filePath, "utf-8");

    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to load featured trailers"
    });
  }
});

export default router;
