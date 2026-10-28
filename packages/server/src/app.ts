import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env";
import { authRoutes } from "./routes/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";
import { NotFoundError } from "./utils/errors";

const app = express();

// Security and utility middlewares
app.use(
   cors({
      origin: env.CLIENT_URL,
      credentials: true,
   }),
);
app.use(express.json());
app.use(cookieParser());

// Base health check route
app.get("/api/health", (_req, res) => {
   res.status(200).json({
      status: "ok",
      timestamp: new Date().toISOString(),
      env: env.NODE_ENV,
   });
});

// API Routes
app.use("/api/auth", authRoutes);

// Catch-all 404 for unmatched routes
app.use((_req, _res, next) => {
   next(new NotFoundError("API endpoint not found"));
});

// Centralized error-handling middleware
app.use(errorHandler);

export { app };
