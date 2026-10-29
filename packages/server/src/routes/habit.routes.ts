import { Router } from "express";
import { habitController } from "../controllers/habit.controller.js";
import { completionController } from "../controllers/completion.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.js";
import {
   createHabitSchema,
   updateHabitSchema,
   habitQuerySchema,
   habitIdParamSchema,
} from "../validators/habit.validator.js";
import {
   completionParamSchema,
   completionQuerySchema,
} from "../validators/completion.validator.js";

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

// Completion routes
router.get(
   "/:id/completions",
   validate({ params: habitIdParamSchema, query: completionQuerySchema }),
   completionController.listCompletions,
);
router.put(
   "/:id/completions/:date",
   validate({ params: completionParamSchema }),
   completionController.markComplete,
);
router.delete(
   "/:id/completions/:date",
   validate({ params: completionParamSchema }),
   completionController.undoComplete,
);

export { router as habitRoutes };
