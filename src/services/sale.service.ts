import { MovementType } from "@/generated/prisma/client";
import { prisma } from "@/prisma-client";
import { CreateSaleInput } from "@/types/user.types";


export async function createSale(input: CreateSaleInput) {
  const { items, ...saleData } = input;

  // Calculate totals on the server-side to ensure integrity
  const subTotal = items.reduce((acc, item) => acc + (item.unitPrice * item.quantity - item.discount), 0);
  const totalAmount = subTotal - saleData.totalDiscount;

  return prisma.$transaction(async (tx) => {
    // 1. Create the Sale and its SaleItems
    const sale = await tx.sale.create({
      data: {
        ...saleData,
        subTotal,
        totalAmount,
        items: {
          create: items.map(item => ({
            productVariantId: item.productVariantId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            discount: item.discount,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // 2. Decrement stock levels and log stock movements for each item sold
    for (const item of sale.items) {
      // Decrement StockLevel
      await tx.stockLevel.update({
        where: {
          productVariantId_locationId: {
            productVariantId: item.productVariantId,
            locationId: sale.locationId,
          },
        },
        data: {
          quantity: {
            decrement: item.quantity,
          },
        },
      });

      // Create StockMovement Log
      await tx.stockMovement.create({
        data: {
          productVariantId: item.productVariantId,
          locationId: sale.locationId,
          quantity: -item.quantity, // Negative for an OUT movement
          movementType: MovementType.SALE,
          referenceId: sale.id,
        },
      });
    }

    return sale;
  });
}

export async function getAllSales() {
    return prisma.sale.findMany({
        include: { cashier: true, location: true, items: true },
        orderBy: { saleDate: 'desc' },
    });
}

export async function getSaleById(id: string) {
    return prisma.sale.findUnique({
        where: { id },
        include: {
            cashier: true,
            customer: true,
            location: true,
            items: {
                include: { productVariant: true }
            }
        }
    });
}