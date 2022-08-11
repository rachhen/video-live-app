import type { Prisma } from "@prisma/client";
import type { Paginated } from "~/schemas/paginated";
import type { StreamingInput } from "~/schemas/streaming";
import { prisma } from "~/services/db.server";

const create = (userId: string, input: StreamingInput) => {
  return prisma.streaming.create({
    data: {
      name: input.name,
      rtmps: input.rtmps,
      loop: input.loop,
      resolution: input.resolution,
      user: { connect: { id: userId } },
      asset: { connect: { id: input.videoId } },
    },
    include: { user: true, asset: true },
  });
};

export type StreamingFindAll = Prisma.PromiseReturnType<typeof findAll>;

const findAll = async (userId: string, opts: Paginated) => {
  const skip = Math.max(opts.page - 1, 0) * opts.limit;

  const data = await prisma.streaming.findMany({
    skip,
    take: opts.limit,
    where: { userId },
    include: { asset: true },
  });

  const totalCount = await prisma.streaming.count({ where: { userId } });
  const total = Math.ceil(totalCount / opts.limit);

  return { data, total };
};

export type StreamingFindById = Prisma.PromiseReturnType<typeof findById>;

const findById = async (id: string) => {
  return prisma.streaming.findUnique({
    where: { id },
    include: { user: true, asset: true },
  });
};

const deleteById = (id: string) => {
  return prisma.streaming.delete({ where: { id } });
};

export default { create, findAll, findById, deleteById };
