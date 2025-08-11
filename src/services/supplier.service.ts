import { prisma } from "@/prisma-client";

// Assuming a simple schema for supplier creation/update
type SupplierInput = { name: string; contactName?: string; phone?: string; email?: string; address?: string };

export async function createSupplier(input: SupplierInput) {
  return prisma.supplier.create({
    data: input,
  });
}

export async function getAllSuppliers() {
  return prisma.supplier.findMany();
}

export async function getSupplierById(id: string) {
  return prisma.supplier.findUnique({
    where: { id },
  });
}

export async function updateSupplier(id: string, data: Partial<SupplierInput>) {
  return prisma.supplier.update({
    where: { id },
    data,
  });
}

export async function deleteSupplier(id: string) {
  return prisma.supplier.delete({
    where: { id },
  });
}