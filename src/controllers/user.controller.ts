import { Request, Response, NextFunction } from "express";
import * as userService from "@/services/user.service";
import { go } from "@/utils/TryCatch";

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [error, newUser] = await go(userService.signup(req.body));
  if (error) next(error);

  res.status(201).json({ message: "User created successfully", user: newUser });
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [error, user] = await go(userService.login(req.body));

  if (!user) return res.status(401).json({ message: "user doesn't exist" });

  if (error) return next(error);

  res.status(200).json({ message: "Login successful", user });
};

import { ChangeFullNameInput, ChangePasswordInput, ForgotPasswordInput, RefreshTokenInput, ResetPasswordInput, VerifyEmailInput } from "@/types/user.types"; // Import the new type

// ... existing signup and login controllers

export const refresh = async (
  req: Request<{}, {}, RefreshTokenInput>,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.body;

  const [error, newTokens] = await go(
    userService.refreshAccessToken(refreshToken)
  );

  if (error) return next(error);

  res.status(200).json(newTokens);
};


interface AuthRequest extends Request {
  user?: { id: string };
}

export const changePassword = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [error, result] = await go(
    userService.changePassword(userId, req.body as ChangePasswordInput)
  );

  if (error) return next(error);

  res.status(200).json(result);
};

export const changeFullName = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [error, updatedUser] = await go(
    userService.changeFullName(userId, req.body as ChangeFullNameInput)
  );

  if (error) return next(error);

  res.status(200).json({
    message: "Full name updated successfully",
    user: updatedUser,
  });
};

export const getMe = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [error, user] = await go(userService.getMe(userId));

  if (error) {
    return next(error);
  }

  res.status(200).json(user);
};


export const forgotPassword = async (
  req: Request<{}, {}, ForgotPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  const [error, result] = await go(userService.forgotPassword(req.body));
  if (error) return next(error);
  res.status(200).json(result);
};

export const resetPassword = async (
  req: Request<{}, {}, ResetPasswordInput>,
  res: Response,
  next: NextFunction
) => {
  const [error, result] = await go(userService.resetPassword(req.body));
  if (error) return next(error);
  res.status(200).json(result);
};

export const verifyEmail = async (
  req: Request<{}, {}, {}, VerifyEmailInput>, // Note: token is in req.query
  res: Response,
  next: NextFunction
) => {
  const [error, result] = await go(userService.verifyEmail(req.query));
  if (error) return next(error);
  res.status(200).json(result);
};

export const resendVerificationEmail = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const [error, result] = await go(userService.resendVerificationEmail(userId));
  if (error) return next(error);
  res.status(200).json(result);
};
