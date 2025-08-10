import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@/generated/prisma";
import {
  ChangePasswordInput,
  ChangeFullNameInput,
  LoginInput,
  SignUpInput,
} from "@/types/user.types";
;
import {
  // ... other imports
  VerifyEmailInput,
} from "@/types/user.types";

import crypto from "crypto"; // <-- Import crypto
import { sendEmail } from "@/utils/sendEmail"; // <-- Import email utility
import { ForgotPasswordInput, ResetPasswordInput } from "@/types/user.types";
import { AppError } from "@/utils/AppError";
import { pickData } from "@/utils/pick";
import { prisma } from "@/prisma-client";

const SALT_ROUNDS = 10;

const {
  JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRATION,
} = process.env;

if (!JWT_ACCESS_SECRET || !JWT_REFRESH_SECRET) {
  throw new Error("FATAL ERROR: JWT secrets are not defined in .env file");
}

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ id: userId }, JWT_ACCESS_SECRET!, {
    expiresIn: JWT_ACCESS_EXPIRATION as any,
  });

  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET!, {
    expiresIn: JWT_REFRESH_EXPIRATION as any,
  });

  return { accessToken, refreshToken };
};

// export const signup = async (userData: SignUpInput) => {
//   const existingUser = await prisma.user.findUnique({
//     where: { email: userData.email },
//   });

//   if (existingUser) throw new Error("User with this email already exists");

//   const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);

//   const newUser = await prisma.user.create({
//     data: { ...userData, password: hashedPassword },
//   });

//   const { accessToken, refreshToken } = generateTokens(newUser.id);

//   const pickedUser = pickData(["id", "email", "fullName"], newUser);

//   return { user: userWithoutPassword, accessToken, refreshToken };
// };

export const login = async (credentials: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
  });

  if (!user) throw new Error("Invalid credentials");

  const isPasswordValid = await bcrypt.compare(
    credentials.password,
    user.password
  );

  if (!isPasswordValid) throw new Error("Invalid credentials");

  const { accessToken, refreshToken } = generateTokens(user.id);

  const pickedUser = pickData(["id", "email", "fullName"], user);

  return { user: pickedUser, accessToken, refreshToken };
};

export const refreshAccessToken = (token: string) => {
  try {
    const decoded = jwt.verify(token, JWT_REFRESH_SECRET!) as { id: string };

    const accessToken = jwt.sign({ id: decoded.id }, JWT_ACCESS_SECRET!, {
      expiresIn: JWT_ACCESS_EXPIRATION as any,
    });

    return Promise.resolve({ accessToken });
  } catch (error) {
    return Promise.reject(new Error("Invalid or expired refresh token."));
  }
};

export const changeFullName = async (
  userId: string,
  data: ChangeFullNameInput
) => {
  // Optional but recommended: Check if another user already has this full name.
  // We use `findFirst` because `fullName` is not a unique field.
  const existingUser = await prisma.user.findFirst({
    where: {
      fullName: data.fullName,
      id: {
        not: userId, // Exclude the current user from the search
      },
    },
  });

  if (existingUser) {
    throw new Error("This full name is already in use by another account.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: { fullName: data.fullName },
    // Select only the fields that are safe to return
    select: { id: true, email: true, fullName: true },
  });

  return updatedUser;
};

export const changePassword = async (
  userId: string,
  data: ChangePasswordInput
) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  // This check is mostly for type-safety; user should exist if JWT is valid
  if (!user) throw new Error("User not found");

  const isPasswordValid = await bcrypt.compare(data.oldPassword, user.password);

  if (!isPasswordValid) throw new Error("Invalid old password");

  const hashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });

  // No need to return user data, just confirm success
  return { message: "Password updated successfully" };
};

export const getMe = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      fullName: true,
    },
  });

  if (!user) {
    throw new Error("User not found.");
  }

  return user;
};

export const forgotPassword = async (data: ForgotPasswordInput) => {
  const user = await prisma.user.findUnique({ where: { email: data.email } });

  // IMPORTANT: Don't reveal if the user was found or not to prevent email enumeration.
  if (!user) {
    return {
      message:
        "If an account with this email exists, a password reset link has been sent.",
    };
  }

  // 1. Generate a secure, random token
  const resetToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash the token before storing it in the DB for security
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  // 3. Set an expiration time (e.g., 10 minutes from now)
  const passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  // 4. Update the user record in the database
  await prisma.user.update({
    where: { id: user.id },
    data: { passwordResetToken, passwordResetExpires },
  });

  // 5. Create the reset URL for the email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

  try {
    // 6. Send the email
    await sendEmail({
      to: user.email,
      subject: "Your Password Reset Link (Valid for 10 min)",
      text: `Forgot your password? Submit a PATCH request with your new password to: ${resetUrl}`,
      html: `<p>Forgot your password? Click the link below to reset it.</p><a href="${resetUrl}">${resetUrl}</a><p>This link is valid for 10 minutes.</p>`,
    });
  } catch (error) {
    // If email fails, clear the reset token from the DB to allow retries
    await prisma.user.update({
      where: { id: user.id },
      data: { passwordResetToken: null, passwordResetExpires: null },
    });
    throw new AppError("Failed to send password reset email. Please try again later.", 500);
  }

  return {
    message:
      "If an account with this email exists, a password reset link has been sent.",
  };
};

export const resetPassword = async (data: ResetPasswordInput) => {
  // 1. Hash the incoming token to match the one in the database
  const hashedToken = crypto
    .createHash("sha256")
    .update(data.token)
    .digest("hex");

  // 2. Find the user by the hashed token and check if it's not expired
  const user = await prisma.user.findFirst({
    where: {
      passwordResetToken: hashedToken,
      passwordResetExpires: {
        gte: new Date(), // "Greater Than or Equal to" now
      },
    },
  });

  if (!user) {
    throw new Error("Token is invalid or has expired.");
  }

  // 3. Hash the new password
  const hashedPassword = await bcrypt.hash(data.newPassword, SALT_ROUNDS);

  // 4. Update the user's password and clear the reset token fields
  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetToken: null,
      passwordResetExpires: null,
    },
  });

  return { message: "Password has been successfully reset." };
};

const sendVerificationEmail = async (user: { id: string, email: string }) => {
  // 1. Generate a secure, random token
  const verificationToken = crypto.randomBytes(32).toString("hex");

  // 2. Hash the token before storing it in the DB
  const emailVerificationToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  // 3. Set an expiration (e.g., 1 hour)
  const emailVerificationExpires = new Date(Date.now() + 60 * 60 * 1000);

  // 4. Update user record with the token
  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerificationToken, emailVerificationExpires },
  });

  // 5. Create the verification URL
  const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;

  // 6. Send the email
  await sendEmail({
    to: user.email,
    subject: "Verify Your Email Address",
    text: `Thanks for signing up! Please verify your email by clicking the following link: ${verificationUrl}`,
    html: `<p>Thanks for signing up!</p><p>Please click the link below to verify your email address:</p><a href="${verificationUrl}">${verificationUrl}</a>`,
  });
};

// --- MODIFIED signup function ---
export const signup = async (userData: SignUpInput) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingUser) throw new AppError("User with this email already exists", 409);

  const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
  const newUser = await prisma.user.create({
    data: { ...userData, password: hashedPassword },
  });

  // Send the verification email
  try {
    await sendVerificationEmail(newUser);
  } catch (error) {
    // This is a soft failure. The user is created, but they'll need to request a new email.
    console.error("Failed to send verification email on signup:", error);
  }

  const { accessToken, refreshToken } = generateTokens(newUser.id);
  const pickedUser = pickData(["id", "email", "fullName"], newUser);

  return { user: pickedUser, accessToken, refreshToken };
};

// --- NEW verifyEmail function ---
export const verifyEmail = async (data: VerifyEmailInput) => {
  const hashedToken = crypto
    .createHash("sha256")
    .update(data.token)
    .digest("hex");

  const user = await prisma.user.findFirst({
    where: {
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { gte: new Date() },
    },
  });

  if (!user) {
    throw new Error("Token is invalid or has expired.");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      isEmailVerified: true,
      emailVerificationToken: null, // Clear the token
      emailVerificationExpires: null,
    },
  });

  return { message: "Email successfully verified." };
};

// --- NEW resendVerificationEmail function ---
export const resendVerificationEmail = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });

  if (!user) throw new Error("User not found.");
  if (user.isEmailVerified) throw new Error("Email is already verified.");

  await sendVerificationEmail(user);

  return { message: "Verification email has been sent." };
};
