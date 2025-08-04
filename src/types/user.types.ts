import { z } from 'zod';

// This is the correct way to define the schema.
// Every property must start with a base type like z.string() or z.object().
export const LoginSchema = z.object({
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

export const SignUpSchema = LoginSchema.extend({
  fullName: z
    .string({
      required_error: 'Full name is required',
    })
    .min(3, 'Full name must be at least 3 characters long'),
});

// TypeScript types are inferred from the corrected schemas
export type LogInType = z.infer<typeof LoginSchema>;
export type SignUpType = z.infer<typeof SignUpSchema>;