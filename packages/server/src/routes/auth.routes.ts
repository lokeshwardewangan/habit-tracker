import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validate.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { signupSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

router.post("/signup", validate({ body: signupSchema }), authController.signup);
router.post("/login", validate({ body: loginSchema }), authController.login);
router.post("/logout", authController.logout);
router.get("/me", authenticate, authController.me);

export { router as authRoutes };
