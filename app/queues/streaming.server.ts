import type Ffmpeg from "fluent-ffmpeg";
import { prisma } from "~/services/db.server";
import type { QueueData } from "~/services/ffmpeg.server";
import { createLiveStream } from "~/services/ffmpeg.server";
import { Queue } from "~/utils/queue.server";

declare global {
  var __runningLives: Record<string, Ffmpeg.FfmpegCommand> | undefined;
}

const __runningLives = global.__runningLives || (global.__runningLives = {});

export const streamingQueue = Queue<QueueData>(
  "streamingQueue",
  async (job) => {
    const { cmd, runStreaming } = createLiveStream(job.data);

    cmd.on("progress", async function (progress) {
      await job.updateProgress(progress.percent);
      // console.log("Processing: " + progress.percent + "% done");
    });

    cmd.once("progress", async () => {
      await prisma.streaming.update({
        where: { id: job.data.id },
        data: { status: "PROCESSING" },
      });
    });

    cmd.once("end", async () => {
      await prisma.streaming.update({
        where: { id: job.data.id },
        data: { status: "DONE" },
      });
      delete __runningLives[job.data.id];
    });

    if (__runningLives[job.data.id]) {
      console.log("Streaming is already running");
      return;
    }

    __runningLives[job.data.id] = cmd;

    await runStreaming();
  }
);

export const stopStreaming = (id: string) => {
  if (global.__runningLives && global.__runningLives[id]) {
    global.__runningLives[id].kill("SIGKILL");
    delete global.__runningLives[id];
  }
};
