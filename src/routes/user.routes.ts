import { Router } from "express";
import * as userController from "@/controllers/user.controller";
import validateResource from "@/middleware/validateResource";
import {
  changeFullNameSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  signUpSchema,
  verifyEmailSchema,
} from "@/types/user.types";
import requireAuth from "@/middleware/requireAuth";

const router = Router();

router.post("/signup", validateResource(signUpSchema), userController.signup);
router.post("/login", validateResource(loginSchema), userController.login);
router.post("/refresh", validateResource(refreshTokenSchema), userController.refresh);
router.post("/forgot-password", validateResource(forgotPasswordSchema), userController.forgotPassword);
router.post("/reset-password", validateResource(resetPasswordSchema), userController.resetPassword );
router.get("/verify-email", validateResource(verifyEmailSchema), userController.verifyEmail );

//protected
router.post("/resend-verification", requireAuth, userController.resendVerificationEmail);
router.get("/me", requireAuth, userController.getMe);
router.patch("/password", requireAuth, validateResource(changePasswordSchema), userController.changePassword);
router.patch("/fullname", requireAuth, validateResource(changeFullNameSchema), userController.changeFullName);

export default router;
