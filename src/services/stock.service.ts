import { prisma } from "@/prisma-client";
import { CreateStockAdjustmentInput } from "@/types/user.types";


export async function getStockForLocation(locationId: string) {
  return prisma.stockLevel.findMany({
    where: { locationId },
    include: {
      productVariant: {
        include: {
          product: true,
        },
      },
    },
  });
}

export async function adjustStock(input: CreateStockAdjustmentInput) {
  const { productVariantId, locationId, quantity, movementType, reason, referenceId } = input;

  return prisma.$transaction(async (tx) => {
    // 1. Update (or create) the stock level
    const stockLevel = await tx.stockLevel.upsert({
      where: {
        productVariantId_locationId: { productVariantId, locationId },
      },
      update: {
        quantity: {
          increment: quantity, // quantity can be negative
        },
      },
      create: {
        productVariantId,
        locationId,
        quantity,
      },
    });

    // 2. Create a stock movement log for audit purposes
    const movement = await tx.stockMovement.create({
      data: {
        productVariantId,
        locationId,
        quantity,
        movementType,
        referenceId: referenceId || `adjustment-${reason.slice(0, 10)}`,
      },
    });

    return { stockLevel, movement };
  });
}