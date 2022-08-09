import type { QueueData } from "~/services/ffmpeg.server";
import { createLiveStream } from "~/services/ffmpeg.server";
import { Queue } from "~/utils/queue.server";

export const streamingQueue = Queue<QueueData>(
  "streamingQueue",
  async (job) => {
    await createLiveStream(job.data);
  }
);
