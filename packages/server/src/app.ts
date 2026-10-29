import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env } from "./config/env.js";
import { authRoutes } from "./routes/auth.routes.js";
import { habitRoutes } from "./routes/habit.routes.js";
import { dashboardRoutes } from "./routes/dashboard.routes.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { NotFoundError } from "./utils/errors.js";

const app = express();

// Security and utility middlewares
app.use(
   cors({
      origin: (origin, callback) => {
         // Allow requests with no origin (mobile clients, curl, server-to-server)
         if (!origin) return callback(null, true);
         const allowed = env.CLIENT_URL.replace(/\/+$/, "");
         if (
            origin === allowed ||
            origin.endsWith(".vercel.app") ||
            origin.includes("localhost") ||
            origin.includes("127.0.0.1")
         ) {
            return callback(null, true);
         }
         return callback(null, true);
      },
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
app.use("/api/habits", habitRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Catch-all 404 for unmatched routes
app.use((_req, _res, next) => {
   next(new NotFoundError("API endpoint not found"));
});

// Centralized error-handling middleware
app.use(errorHandler);

export { app };
