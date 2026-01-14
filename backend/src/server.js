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

const allowedOrigins = [
  'http://localhost',
  'http://localhost:5173',
  'http://localhost:80',
  'http://127.0.0.1',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL,
  process.env.NODE_ENV === 'production' && 'https://your-production-domain.onrender.com'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));


app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/blog", blogRoutes);


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () =>
  console.log(`Server running on port ${PORT}`)
);