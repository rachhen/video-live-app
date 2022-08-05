import type { Prisma } from "@prisma/client";
import { prisma } from "~/services/db.server";

export type FindAllAsset = Prisma.PromiseReturnType<typeof findAll>;

export const findAll = (userId: string) => {
  return prisma.asset.findMany({
    where: { userId },
  });
};

export const findById = (id: string, userId: string) => {
  return prisma.asset.findFirst({ where: { id, userId } });
};

export const create = (asset: Prisma.AssetCreateInput) => {
  return prisma.asset.create({
    data: asset,
  });
};

export const deleteById = (id: string) => {
  return prisma.asset.delete({ where: { id } });
};

export default {
  findAll,
  findById,
  create,
  deleteById,
};
