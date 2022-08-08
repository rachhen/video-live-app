import type { Prisma } from "@prisma/client";
import type { StreamingInput } from "~/schemas/streaming";
import { prisma } from "~/services/db.server";

const create = (userId: string, input: StreamingInput) => {
  return prisma.streaming.create({
    data: {
      name: input.name,
      rtmps: input.rtmps,
      loop: input.loop,
      user: { connect: { id: userId } },
      asset: { connect: { id: input.videoId } },
    },
  });
};

export type StreamingFindAll = Prisma.PromiseReturnType<typeof findAll>;

export const findAll = (userId: string) => {
  return prisma.streaming.findMany({ where: { userId } });
};

export default { create, findAll };
