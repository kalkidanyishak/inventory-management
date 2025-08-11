import { prisma } from "@/prisma-client";

// Assuming a simple schema for location creation/update
type LocationInput = { name: string; address?: string };

export async function createLocation(input: LocationInput) {
  return prisma.location.create({
    data: input,
  });
}

export async function getAllLocations() {
  return prisma.location.findMany();
}

export async function getLocationById(id: string) {
  return prisma.location.findUnique({
    where: { id },
  });
}

export async function updateLocation(id: string, data: Partial<LocationInput>) {
  return prisma.location.update({
    where: { id },
    data,
  });
}

export async function deleteLocation(id: string) {
  return prisma.location.delete({
    where: { id },
  });
}