import { ChangeFullNameInput, ChangePasswordInput, ForgotPasswordInput, ResetPasswordInput, VerifyEmailInput } from "@/types/user.types"; // Import the new type
import { Request, Response, NextFunction } from "express";
import * as userService from "@/services/user.service";
import { go } from "@/utils/TryCatch";
import { sendTokens, sendAccessToken, clearTokens } from "@/utils/authCookie.utils"; 


export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [error, result] = await go(userService.signup(req.body));

  if (error) return next(error);
  
  if (result) {
    const { user, accessToken, refreshToken } = result;
    sendTokens(res, accessToken, refreshToken);
    return res.status(201).json(user);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const [error, result] = await go(userService.login(req.body));

  if (error) return next(error);

  if (result) {
    const { user, accessToken, refreshToken } = result;
    sendTokens(res, accessToken, refreshToken);
    return res.status(200).json(user);
  }
};

export const logout = (req: Request, res: Response) => {
  clearTokens(res);
  return res.status(200).json({ message: "Logged out successfully." });
};

export const refresh = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized: No refresh token." });
  }

  const [error, newTokens] = await go(
    userService.refreshAccessToken(refreshToken)
  );

  if (error) return next(error);

  if (newTokens) {
    sendAccessToken(res, newTokens.accessToken);
    return res.status(200).json({ message: "Token refreshed successfully." });
  }
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
