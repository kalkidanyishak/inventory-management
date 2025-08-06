import { z } from 'zod';

// --- Reusable Core Schemas ---

// 1. Create a single, reusable, strong password schema.
// This ensures password rules are consistent everywhere (signup, reset, change).
const passwordSchema = z
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
  );

// 2. Create a reusable email schema.
const emailSchema = z
  .string({ required_error: 'Email is required' })
  .email('Invalid email address');

// 3. Create a reusable full name schema.
const fullNameSchema = z
  .string({ required_error: 'Full name is required' })
  .min(3, 'Full name must be at least 3 characters long');


// --- Composite Schemas for Validation ---

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string({ required_error: 'Password is required' }), // Login password doesn't need validation, just presence.
  }),
});

export const signUpSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: passwordSchema, // Use the strong password schema
    fullName: fullNameSchema,
  }),
});

export const changeFullNameSchema = z.object({
  body: z.object({
    fullName: fullNameSchema,
  }),
});

export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string({ required_error: 'Old password is required' }),
    newPassword: passwordSchema, // Use the strong password schema for the new password
  }),
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: emailSchema,
  }),
});

export const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string({ required_error: 'Token is required' }),
    newPassword: passwordSchema, // Use the strong password schema here too
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string({ required_error: 'Verification token is required' }),
  }),
});


// --- REMOVED ---
// export const refreshTokenSchema = z.object({ ... });
// This is no longer needed as the refresh token is in an HttpOnly cookie.


// --- Exported Types ---

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>['query'];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>['body'];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>['body'];
export type ChangeFullNameInput = z.infer<typeof changeFullNameSchema>['body'];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type SignUpInput = z.infer<typeof signUpSchema>['body'];

// The RefreshTokenInput type is no longer needed and has been removed.