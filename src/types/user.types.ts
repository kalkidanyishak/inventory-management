import {
  PaymentMethod,
  PurchaseOrderStatus,
  MovementType,
  ReturnType,
} from "@/generated/prisma/client";
import { z } from "zod";

// --- Reusable Core Schemas ---

// 1. Create a single, reusable, strong password schema.
// This ensures password rules are consistent everywhere (signup, reset, change).
const passwordSchema = z
  .string({
    required_error: "Password is required",
  })
  .min(8, "Password must be at least 8 characters long")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character"
  );

// 2. Create a reusable email schema.
const emailSchema = z
  .string({ required_error: "Email is required" })
  .email("Invalid email address");

// 3. Create a reusable full name schema.
const fullNameSchema = z
  .string({ required_error: "Full name is required" })
  .min(3, "Full name must be at least 3 characters long");

// --- Composite Schemas for Validation ---

export const loginSchema = z.object({
  body: z.object({
    email: emailSchema,
    password: z.string({ required_error: "Password is required" }), // Login password doesn't need validation, just presence.
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
    oldPassword: z.string({ required_error: "Old password is required" }),
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
    token: z.string({ required_error: "Token is required" }),
    newPassword: passwordSchema, // Use the strong password schema here too
  }),
});

export const verifyEmailSchema = z.object({
  query: z.object({
    token: z.string({ required_error: "Verification token is required" }),
  }),
});

// --- REMOVED ---
// export const refreshTokenSchema = z.object({ ... });
// This is no longer needed as the refresh token is in an HttpOnly cookie.

// --- Exported Types ---

// 1. A reusable UUID schema for all model IDs.
const idSchema = z.string({ required_error: 'ID is required' }).uuid('Invalid UUID format');

// 2. A reusable schema for common 'name' fields (Category, Manufacturer, etc.).
const nameSchema = z
  .string({ required_error: 'Name is required' })
  .min(2, 'Name must be at least 2 characters long');

// 3. A reusable schema for positive numbers (prices, costs).
const positiveNumberSchema = z
  .number({ required_error: 'Numeric value is required' })
  .positive('Value must be a positive number');

// 4. A reusable schema for positive integers (quantities).
const positiveIntSchema = z
  .number({ required_error: 'Quantity is required' })
  .int('Quantity must be a whole number')
  .positive('Quantity must be a positive number');

// 5. A reusable email schema.

// 6. A reusable phone number schema (optional).
const phoneSchema = z
  .string()
  .min(10, 'Phone number seems too short')
  .optional();

// --- Composite Schemas for API Validation ---

// --- Category Schemas ---
export const createCategorySchema = z.object({
  body: z.object({
    name: nameSchema,
  }),
});

export const updateCategorySchema = z.object({
  params: z.object({ id: idSchema }),
  body: z.object({
    name: nameSchema,
  }),
});

// --- Product & Variant Schemas ---
export const createProductSchema = z.object({
  body: z.object({
    name: nameSchema,
    categoryId: idSchema,
    unitId: idSchema,
    manufacturerId: idSchema.optional(),
    // Expect at least one variant when creating a new product
    variants: z
      .array(
        z.object({
          sku: z.string({ required_error: 'SKU is required' }),
          price: positiveNumberSchema,
          reorderLevel: positiveIntSchema,
          attributes: z.record(z.string(), z.any()).optional(), // For JSON: { "color": "Red" }
        })
      )
      .min(1, 'Product must have at least one variant'),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({ id: idSchema }),
  body: z.object({
    name: nameSchema.optional(),
    categoryId: idSchema.optional(),
    unitId: idSchema.optional(),
    manufacturerId: idSchema.optional().nullable(),
  }),
});

export const updateProductVariantSchema = z.object({
  params: z.object({ variantId: idSchema }),
  body: z.object({
    sku: z.string().optional(),
    price: positiveNumberSchema.optional(),
    reorderLevel: positiveIntSchema.optional(),
    attributes: z.record(z.string(), z.any()).optional(),
  }),
});


// --- Purchase Order Schemas ---
export const createPurchaseOrderSchema = z.object({
  body: z.object({
    supplierId: idSchema,
    locationId: idSchema,
    items: z
      .array(
        z.object({
          productVariantId: idSchema,
          quantityOrdered: positiveIntSchema,
          unitPrice: positiveNumberSchema,
        })
      )
      .min(1, 'Purchase order must contain at least one item'),
  }),
});

// Schema for receiving items from a purchase order
export const receivePurchaseOrderSchema = z.object({
  params: z.object({ id: idSchema }), // The PurchaseOrder ID
  body: z.object({
    items: z
      .array(
        z.object({
          purchaseOrderItemId: idSchema,
          quantityReceived: positiveIntSchema,
        })
      )
      .min(1, 'Must provide at least one item to receive'),
  }),
});

// --- Sale Schemas ---
export const createSaleSchema = z.object({
  body: z.object({
    cashierId: idSchema,
    locationId: idSchema,
    customerId: idSchema.optional().nullable(),
    paymentMethod: z.nativeEnum(PaymentMethod),
    totalDiscount: z.number().min(0).default(0),
    items: z
      .array(
        z.object({
          productVariantId: idSchema,
          quantity: positiveIntSchema,
          unitPrice: positiveNumberSchema, // Price at time of sale
          discount: z.number().min(0).default(0),
        })
      )
      .min(1, 'A sale must contain at least one item'),
  }),
});

// --- Customer Schemas ---
export const createCustomerSchema = z.object({
  body: z.object({
    name: nameSchema,
    phone: phoneSchema,
    email: emailSchema.optional(),
  }),
});

// --- Stock Schemas ---
export const createStockAdjustmentSchema = z.object({
  body: z.object({
    productVariantId: idSchema,
    locationId: idSchema,
    quantity: z.number().int(), // Can be negative for reductions
    movementType: z.nativeEnum(MovementType, {
      errorMap: () => ({ message: 'Invalid movement type' }),
    }),
    referenceId: z.string().optional(),
    reason: z.string({ required_error: 'A reason for the adjustment is required' }),
  }),
});

// --- Return Schemas ---
export const createReturnOrderSchema = z.object({
  body: z.object({
    returnType: z.nativeEnum(ReturnType),
    reason: z.string().optional(),
    saleId: idSchema.optional(),
    purchaseOrderId: idSchema.optional(),
    items: z
      .array(
        z.object({
          productVariantId: idSchema,
          quantity: positiveIntSchema,
        })
      )
      .min(1, 'A return must contain at least one item'),
  }),
});

// --- Generic Schemas ---
// Useful for any endpoint that just needs an ID from the URL params (e.g., GET, DELETE)
export const paramsWithIdSchema = z.object({
  params: z.object({
    id: idSchema,
  }),
});


// --- Exported Types ---

export type CreateCategoryInput = z.infer<typeof createCategorySchema>['body'];
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

export type CreateProductInput = z.infer<typeof createProductSchema>['body'];
export type UpdateProductInput = z.infer<typeof updateProductSchema>['body'];
export type UpdateProductVariantInput = z.infer<typeof updateProductVariantSchema>['body'];

export type CreatePurchaseOrderInput = z.infer<typeof createPurchaseOrderSchema>['body'];
export type ReceivePurchaseOrderInput = z.infer<typeof receivePurchaseOrderSchema>['body'];

export type CreateSaleInput = z.infer<typeof createSaleSchema>['body'];

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>['body'];

export type CreateStockAdjustmentInput = z.infer<typeof createStockAdjustmentSchema>['body'];

export type CreateReturnOrderInput = z.infer<typeof createReturnOrderSchema>['body'];

export type ParamsWithIdInput = z.infer<typeof paramsWithIdSchema>['params'];

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>["query"];
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>["body"];
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>["body"];
export type ChangeFullNameInput = z.infer<typeof changeFullNameSchema>["body"];
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>["body"];
export type LoginInput = z.infer<typeof loginSchema>["body"];
export type SignUpInput = z.infer<typeof signUpSchema>["body"];

// The RefreshTokenInput type is no longer needed and has been removed.
