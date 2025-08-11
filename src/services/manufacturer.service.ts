import { prisma } from "@/prisma-client";

// Assuming a simple schema for manufacturer creation/update
type ManufacturerInput = { name: string; contact?: string; phone?: string; email?: string; address?: string };

export async function createManufacturer(input: ManufacturerInput) {
  return prisma.manufacturer.create({
    data: input,
  });
}

export async function getAllManufacturers() {
  return prisma.manufacturer.findMany();
}

export async function getManufacturerById(id: string) {
  return prisma.manufacturer.findUnique({
    where: { id },
  });
}

export async function updateManufacturer(id: string, data: Partial<ManufacturerInput>) {
  return prisma.manufacturer.update({
    where: { id },
    data,
  });
}

export async function deleteManufacturer(id: string) {
  return prisma.manufacturer.delete({
    where: { id },
  });
}