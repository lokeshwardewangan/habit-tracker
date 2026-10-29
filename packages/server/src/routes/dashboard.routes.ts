import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import { dashboardStatsQuerySchema } from "../validators/dashboard.validator.js";

const router = Router();

// Dashboard routes require authentication
router.use(authenticate);

router.get(
   "/stats",
   validate({ query: dashboardStatsQuerySchema }),
   dashboardController.getStats,
);

export { router as dashboardRoutes };
