import { MovementType, PurchaseOrderStatus } from "@/generated/prisma/client";
import { prisma } from "@/prisma-client";
import { CreatePurchaseOrderInput, ReceivePurchaseOrderInput } from "@/types/user.types";


export async function createPurchaseOrder(input: CreatePurchaseOrderInput) {
  const { items, ...orderData } = input;
  return prisma.purchaseOrder.create({
    data: {
      ...orderData,
      items: {
        create: items, // Nested write for order items
      },
    },
  });
}

export async function getAllPurchaseOrders() {
  return prisma.purchaseOrder.findMany({
    include: { supplier: true, location: true, items: true },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getPurchaseOrderById(id: string) {
  return prisma.purchaseOrder.findUnique({
    where: { id },
    include: {
      supplier: true,
      location: true,
      items: {
        include: { productVariant: true },
      },
    },
  });
}

// Business Logic: Not just CRUD, but a process
export async function receivePurchaseOrder(poId: string, input: ReceivePurchaseOrderInput) {
  const purchaseOrder = await getPurchaseOrderById(poId);
  if (!purchaseOrder) throw new Error('Purchase Order not found');

  return prisma.$transaction(async (tx) => {
    // 1. Update stock levels and create movement logs for each received item
    for (const item of input.items) {
      const orderItem = purchaseOrder.items.find(oi => oi.id === item.purchaseOrderItemId);
      if (!orderItem) throw new Error(`Item ${item.purchaseOrderItemId} not found in this PO.`);

      // Update StockLevel
      await tx.stockLevel.upsert({
        where: {
          productVariantId_locationId: {
            productVariantId: orderItem.productVariantId,
            locationId: purchaseOrder.locationId,
          },
        },
        update: {
          quantity: {
            increment: item.quantityReceived,
          },
        },
        create: {
          productVariantId: orderItem.productVariantId,
          locationId: purchaseOrder.locationId,
          quantity: item.quantityReceived,
        },
      });

      // Create StockMovement Log
      await tx.stockMovement.create({
        data: {
          productVariantId: orderItem.productVariantId,
          locationId: purchaseOrder.locationId,
          quantity: item.quantityReceived,
          movementType: MovementType.PURCHASE_RECEIPT,
          referenceId: purchaseOrder.id,
        },
      });

      // Update the quantity received on the PO item
      await tx.purchaseOrderItem.update({
          where: { id: item.purchaseOrderItemId },
          data: {
              quantityReceived: { increment: item.quantityReceived }
          }
      });
    }

    // 2. Update the main PO status
    const updatedPO = await tx.purchaseOrder.update({
      where: { id: poId },
      data: {
        status: PurchaseOrderStatus.RECEIVED,
        receivedAt: new Date(),
      },
    });

    return updatedPO;
  });
}