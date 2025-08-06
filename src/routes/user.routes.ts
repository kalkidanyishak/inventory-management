import { Router } from "express";
import * as userController from "@/controllers/user.controller";
import validateResource from "@/middleware/validateResource";
import {
  changeFullNameSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  // refreshTokenSchema is no longer needed here as the route doesn't take a body
  resetPasswordSchema,
  signUpSchema,
  verifyEmailSchema,
} from "@/types/user.types";
import requireAuth from "@/middleware/requireAuth";

const router = Router();

// --- Public Authentication Routes ---
router.post("/signup", validateResource(signUpSchema), userController.signup);
router.post("/login", validateResource(loginSchema), userController.login);

// The refresh route no longer needs validation as it reads from a cookie
router.post("/refresh", userController.refresh);

// --- Password & Email Verification Routes (Public) ---
router.post("/forgot-password", validateResource(forgotPasswordSchema), userController.forgotPassword);
router.post("/reset-password", validateResource(resetPasswordSchema), userController.resetPassword );
router.get("/verify-email", validateResource(verifyEmailSchema), userController.verifyEmail );

// --- Protected Routes (Require a valid access token cookie) ---

router.post("/logout", requireAuth, userController.logout);
router.post("/resend-verification", requireAuth, userController.resendVerificationEmail);
router.get("/me", requireAuth, userController.getMe);
router.patch("/password", requireAuth, validateResource(changePasswordSchema), userController.changePassword);
router.patch("/fullname", requireAuth, validateResource(changeFullNameSchema), userController.changeFullName);

export default router;