import { z } from 'zod';

const userAuthCredentials = z.object({
  email: z.string().email({ message: 'Invalid email address' }),

  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(8, 'Password must be at least 8 characters long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(
      /[^A-Za-z0-9]/,
      'Password must contain at least one special character'
    ),
});


export const loginSchema = z.object({
  body: userAuthCredentials,
});

export const signUpSchema = z.object({
  body: userAuthCredentials.extend({
    fullName: z
      .string({
        required_error: 'Full name is required',
      })
      .min(3, 'Full name must be at least 3 characters long'),
  }),
});
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string({
      required_error: "Refresh token is required",
    }),
  }),
});

export const changeFullNameSchema = z.object({
  body: z.object({
    fullName: z
      .string({ required_error: "Full name is required" })
      .min(3, "Full name must be at least 3 characters long"),
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: "Old password is required" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: "Token is required" }),
    newPassword: z
      .string({ required_error: "New password is required" })
      .min(6, "Password must be at least 6 characters long"),
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string({ required_error: "Verification token is required" }),
  }),
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["query"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
export type ChangeFullNameInput = z.infer<typeof changeFullNameSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type RefreshTokenInput = z.infer<typeof refreshTokenSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type SignUpInput = z.infer<typeof signUpSchema>['body'];