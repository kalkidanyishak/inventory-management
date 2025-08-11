import { MovementType, ReturnType } from "@/generated/prisma/client";
import { prisma } from "@/prisma-client";
import { CreateReturnOrderInput } from "@/types/user.types";


export async function createReturnOrder(input: CreateReturnOrderInput) {
  const { items, ...returnData } = input;

  return prisma.$transaction(async (tx) => {
    // 1. Create the ReturnOrder and its items
    const returnOrder = await tx.returnOrder.create({
      data: {
        ...returnData,
        items: {
          create: items,
        },
      },
      include: {
        items: true,
        relatedSale: true,
      }
    });

    const locationId = returnOrder.relatedSale?.locationId;
    if (!locationId) throw new Error("Could not determine location for stock movement.");

    // 2. Adjust stock levels based on return type
    for (const item of returnOrder.items) {
      const quantityChange = item.quantity;
      let movementType: MovementType;

      if (returnOrder.returnType === ReturnType.CUSTOMER) {
        // Stock comes back IN
        movementType = MovementType.CUSTOMER_RETURN;
        await tx.stockLevel.update({
          where: { productVariantId_locationId: { productVariantId: item.productVariantId, locationId } },
          data: { quantity: { increment: quantityChange } },
        });
      } else { // SUPPLIER return
        // Stock goes OUT
        movementType = MovementType.SUPPLIER_RETURN;
        await tx.stockLevel.update({
          where: { productVariantId_locationId: { productVariantId: item.productVariantId, locationId } },
          data: { quantity: { decrement: quantityChange } },
        });
      }

      // 3. Create a stock movement log
      await tx.stockMovement.create({
          data: {
              productVariantId: item.productVariantId,
              locationId: locationId,
              quantity: returnOrder.returnType === ReturnType.CUSTOMER ? quantityChange : -quantityChange,
              movementType: movementType,
              referenceId: returnOrder.id
          }
      });
    }

    return returnOrder;
  });
}

export async function getAllReturnOrders() {
    return prisma.returnOrder.findMany({
        include: { items: true, relatedSale: true, relatedPO: true },
        orderBy: { date: 'desc' }
    });
}