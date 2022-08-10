import type Ffmpeg from "fluent-ffmpeg";
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

    if (__runningLives[job.data.id]) {
      console.log("Streaming is already running");
      return;
    }

    __runningLives[job.data.id] = cmd;

    await runStreaming();
  }
);

streamingQueue.on("removed", async (job) => {
  console.log("removed", job.data.id);
  const cmd = __runningLives[job.data.id];
  if (cmd) {
    cmd.kill("SIGKILL");
    delete __runningLives[job.data.id];
  }
});
