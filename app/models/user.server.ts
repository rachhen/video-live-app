import type { User } from "@prisma/client";
import type { RegisterInput } from "~/schemas/auth";
import { prisma } from "~/services/db.server";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function createUser(user: RegisterInput) {
  return prisma.user.create({ data: user });
}
