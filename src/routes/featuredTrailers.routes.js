import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();

router.get("/featured-trailers", (req, res) => {
  try {
    const filePath = path.join(
      process.cwd(),
      "data",
      "featuredTrailers.json"
    );

    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);

    res.json(data);
  } catch (err) {
    console.error("Featured trailers error:", err);

    res.status(500).json({
      success: false,
      message: "Failed to load featured trailers"
    });
  }
});

export default router;
