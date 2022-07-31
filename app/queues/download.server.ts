import { downloadFile } from "~/utils/download.server";
import { Queue } from "~/utils/queue.server";

type QueueData = {
  url: string;
};

export const queue = Queue<QueueData>("download", async (job) => {
  console.log(`Downloading ${job.data.url}`);

  await downloadFile(job.data.url, "movie.mp4");

  console.log(`Downloaded ${job.data.url}`);
});
