import { Router } from "express";
import { habitController } from "../controllers/habit.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate";
import {
   createHabitSchema,
   updateHabitSchema,
   habitQuerySchema,
   habitIdParamSchema,
} from "../validators/habit.validator";

const router = Router();

// All habit routes require authentication
router.use(authenticate);

router.get("/", validate({ query: habitQuerySchema }), habitController.list);
router.post("/", validate({ body: createHabitSchema }), habitController.create);

router.get(
   "/:id",
   validate({ params: habitIdParamSchema }),
   habitController.getById,
);
router.patch(
   "/:id",
   validate({ params: habitIdParamSchema, body: updateHabitSchema }),
   habitController.update,
);
router.delete(
   "/:id",
   validate({ params: habitIdParamSchema }),
   habitController.delete,
);

router.post(
   "/:id/archive",
   validate({ params: habitIdParamSchema }),
   habitController.archive,
);
router.post(
   "/:id/unarchive",
   validate({ params: habitIdParamSchema }),
   habitController.unarchive,
);

export { router as habitRoutes };
