import { prisma } from "@/prisma-client";

// Assuming a simple schema for unit creation/update
type UnitOfMeasureInput = { name: string };

export async function createUnitOfMeasure(input: UnitOfMeasureInput) {
  return prisma.unitOfMeasure.create({
    data: input,
  });
}

export async function getAllUnitsOfMeasure() {
  return prisma.unitOfMeasure.findMany();
}

export async function getUnitOfMeasureById(id: string) {
  return prisma.unitOfMeasure.findUnique({
    where: { id },
  });
}

export async function updateUnitOfMeasure(id: string, data: UnitOfMeasureInput) {
  return prisma.unitOfMeasure.update({
    where: { id },
    data,
  });
}

export async function deleteUnitOfMeasure(id: string) {
  return prisma.unitOfMeasure.delete({
    where: { id },
  });
}