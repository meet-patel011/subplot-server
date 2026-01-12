import dotenv from "dotenv";
dotenv.config();

console.log("TMDB_API_KEY loaded successfully");

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/connect.js";
import tmdbRoutes from "./routes/tmdb.routes.js";
import testRoutes from "./routes/test.routes.js";
import editorsRoutes from "./routes/editors.routes.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import watchlistRoutes from "./routes/watchlist.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import postRoutes from "./routes/post.routes.js";
import commentRoutes from "./routes/comment.routes.js";
import newsRoutes from "./routes/news.routes.js";

// INIT APP
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "https://thesubplot.vercel.app",
    "http://127.0.0.1:5501",
    "http://localhost:5501"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  
}));

// MIDDLEWARES
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));

app.use(cookieParser());

// Request logger (helpful for debugging)
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// DATABASE
connectDB();

// HEALTH CHECK
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Flicker backend is running",
    timestamp: new Date().toISOString(),
    env: {
      tmdbKeyLoaded: !!process.env.TMDB_API_KEY,
      newsKeyLoaded: !!process.env.NEWS_API_KEY,
    }
  });
});

// ROUTES
app.use("/api", testRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/watchlist", watchlistRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/tmdb", tmdbRoutes);
app.use("/api/editors-picks", editorsRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.url} not found`,
  });
});

// ERROR HANDLER
app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  console.error(err.stack);
  
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`
  Port: ${PORT} 
  Health: http://localhost:${PORT}/health 
  TMDB API: ${process.env.TMDB_API_KEY ? 'Loaded' : 'Missing'}            
  `);
});

// shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM received, shutting down gracefully...");
  process.exit(0);
});