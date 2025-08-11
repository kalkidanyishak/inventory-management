import { prisma } from "@/prisma-client";
import { CreateCategoryInput, UpdateCategoryInput } from "@/types/user.types";

export async function createCategory(input: CreateCategoryInput) {
  return prisma.category.create({
    data: input,
  });
}

export async function getAllCategories() {
  return prisma.category.findMany();
}

export async function getCategoryById(id: string) {
  return prisma.category.findUnique({
    where: { id },
  });
}

export async function updateCategory(id:string, data: UpdateCategoryInput['body']) {
  return prisma.category.update({
    where: { id },
    data,
  });
}

export async function deleteCategory(id: string) {
  return prisma.category.delete({
    where: { id },
  });
}