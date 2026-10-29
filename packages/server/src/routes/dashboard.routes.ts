import { Router } from "express";
import { dashboardController } from "../controllers/dashboard.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import { dashboardStatsQuerySchema } from "../validators/dashboard.validator";

const router = Router();

// Dashboard routes require authentication
router.use(authenticate);

router.get(
   "/stats",
   validate({ query: dashboardStatsQuerySchema }),
   dashboardController.getStats,
);

export { router as dashboardRoutes };
