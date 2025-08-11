import { prisma } from "@/prisma-client";
import { CreateCustomerInput } from "@/types/user.types";


export async function createCustomer(input: CreateCustomerInput) {
  return prisma.customer.create({
    data: input,
  });
}

export async function getAllCustomers() {
  return prisma.customer.findMany();
}

export async function getCustomerById(id: string) {
  return prisma.customer.findUnique({
    where: { id },
  });
}

export async function updateCustomer(id: string, data: Partial<CreateCustomerInput>) {
  return prisma.customer.update({
    where: { id },
    data,
  });
}

export async function deleteCustomer(id: string) {
  return prisma.customer.delete({
    where: { id },
  });
}