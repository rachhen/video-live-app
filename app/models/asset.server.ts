import type { Prisma } from "@prisma/client";
import type { Paginated } from "~/schemas/paginated";
import { prisma } from "~/services/db.server";

export type FindAllAsset = Prisma.PromiseReturnType<typeof findAll>;

export const findAll = async (userId: string, opts: Paginated) => {
  const skip = Math.max(opts.page - 1, 0) * opts.limit;
  const data = await prisma.asset.findMany({
    skip,
    take: opts.limit,
    where: { userId },
  });

  const totalCount = await prisma.asset.count({ where: { userId } });
  const total = Math.ceil(totalCount / opts.limit);

  return {
    data,
    total,
  };
};

export type FindOneAsset = Prisma.PromiseReturnType<typeof findById>;
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
