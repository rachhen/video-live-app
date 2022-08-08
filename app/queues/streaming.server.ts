import type { Streaming } from "@prisma/client";
import { Queue } from "~/utils/queue.server";

export const streamingQueue = Queue<Streaming>(
  "streamingQueue",
  async (job) => {
    console.log("Streaming job", job.data);
  }
);
