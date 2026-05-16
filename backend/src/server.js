
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check routes
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.json({ message: "API is working successfully!" });
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Only connect to DB and listen locally (not on Vercel)
if (process.env.NODE_ENV !== "production") {
  connectDB();
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

export default app;