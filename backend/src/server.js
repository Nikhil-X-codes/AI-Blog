import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "../config/db.js";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import { errorHandler, notFound } from "./utils/errorHandler.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/ping", (req, res) => {
  res.status(200).json({ message: "pong" });
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});