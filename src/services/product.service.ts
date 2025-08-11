import { prisma } from "@/prisma-client";
import { CreateProductInput, UpdateProductInput, UpdateProductVariantInput } from "@/types/user.types";


export async function createProduct(input: CreateProductInput) {
  const { variants, ...productData } = input;
  return prisma.product.create({
    data: {
      ...productData,
      variants: {
        create: variants, // Nested write to create variants simultaneously
      },
    },
    include: {
      variants: true,
    },
  });
}

export async function getAllProducts() {
  return prisma.product.findMany({
    include: {
      category: true,
      manufacturer: true,
      unitOfMeasure: true,
      variants: true,
    },
  });
}

export async function getProductById(id: string) {
  return prisma.product.findUnique({
    where: { id },
    include: {
      category: true,
      manufacturer: true,
      unitOfMeasure: true,
      variants: {
        include: {
          stockLevels: true, // Include stock levels for each variant
        },
      },
    },
  });
}

export async function updateProduct(id: string, data: UpdateProductInput) {
  return prisma.product.update({
    where: { id },
    data,
  });
}

export async function updateProductVariant(variantId: string, data: UpdateProductVariantInput) {
    return prisma.productVariant.update({
        where: { id: variantId },
        data,
    });
}

export async function deleteProduct(id: string) {
  // Note: Depending on your schema's onDelete behavior, this might fail
  // if variants have related data (e.g., sales).
  return prisma.product.delete({
    where: { id },
  });
}