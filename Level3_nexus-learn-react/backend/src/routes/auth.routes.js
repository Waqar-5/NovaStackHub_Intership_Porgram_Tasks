import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../validators/authValidators.js";
import * as authController from "../controllers/authController.js";

const router = Router();

router.post("/register", authLimiter, validate(registerSchema), authController.register);
router.get("/verify-email/:token", validate(verifyEmailSchema), authController.verifyEmail);
router.post("/login", authLimiter, validate(loginSchema), authController.login);
router.post("/refresh-token", authController.refresh);
router.post("/logout", requireAuth, authController.logout);
router.post(
  "/forgot-password",
  authLimiter,
  validate(forgotPasswordSchema),
  authController.forgotPassword
);
router.post(
  "/reset-password/:token",
  authLimiter,
  validate(resetPasswordSchema),
  authController.resetPassword
);
router.get("/me", requireAuth, authController.me);

export default router;
