import { Router } from "express";
import { authController } from "../controllers/auth.controller";
import { validate } from "../middlewares/validate";
import { authenticate } from "../middlewares/auth.middleware";
import { signupSchema, loginSchema } from "../validators/auth.validator";

const router = Router();

router.post("/signup", validate({ body: signupSchema }), authController.signup);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export { router as authRoutes };
