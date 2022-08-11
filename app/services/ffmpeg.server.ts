import ffmpeg from "fluent-ffmpeg";
import type { Asset, Streaming, User } from "@prisma/client";
import { directory } from "~/utils/file-upload.server";
import { resolutionsMap } from "~/constants/resolutions";
import type { Resolution } from "~/schemas/streaming";

export type QueueData = Streaming & {
  user: User;
  asset: Asset;
};

type CreateLiveStream = {
  cmd: ffmpeg.FfmpegCommand;
  runStreaming: () => Promise<void>;
};

export const createLiveStream = (streaming: QueueData): CreateLiveStream => {
  const resolution = resolutionsMap[streaming.resolution as Resolution];
  const cmd = ffmpeg(`${directory}/${streaming.asset.path}`) //("./source.mp4"))
    .inputOptions("-re")
    .inputOptions("-y")
    .inputOption("-stream_loop", streaming.loop.toString())
    .audioCodec("libmp3lame")
    .audioCodec("copy")
    .audioChannels(2)
    .audioBitrate(128)
    .videoCodec("libx264")
    .videoBitrate(resolution.videoBitrate)
    .addOption("-pix_fmt", "yuv420p")
    .addOption("-vf", `scale=${resolution.size}`)
    .addOption("-r", "30")
    .addOption("-g", "60")
    .addOption("-tune", "zerolatency")
    .addOption("-f", "flv")
    .addOption("-maxrate", resolution.maxrate)
    .addOption("-preset", "veryfast")
    .output(streaming.rtmps, { end: true });

  const runStreaming = () =>
    new Promise<void>((resolve, reject) => {
      cmd
        .on("error", async function (err) {
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .on("end", async function () {
          resolve();
        });

      cmd.run();
    });

  return { cmd, runStreaming };
};
