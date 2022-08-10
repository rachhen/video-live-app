import ffmpeg from "fluent-ffmpeg";
import { prisma } from "~/services/db.server";
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
  runStreaming: () => Promise<Streaming>;
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
    new Promise<Streaming>((resolve, reject) => {
      cmd
        .on("start", async function (commandLine) {
          console.log("Spawned FFMPEG with command: " + commandLine);
          // await prisma.streaming.update({
          //   where: { id: streaming.id },
          //   data: { status: "STARTED" },
          // });
        })
        .on("error", async function (err) {
          // await prisma.streaming.update({
          //   where: { id: streaming.id },
          //   data: { status: "ERROR" },
          // });
          console.log(err);
          console.log("An error occurred: " + err.message);
          reject(err);
        })
        .on("end", async function () {
          // const st = await prisma.streaming.update({
          //   where: { id: streaming.id },
          //   data: { status: "DONE" },
          // });
          resolve(streaming);
        })
        .once("progress", async function (progress) {
          console.log("Processing: " + progress.percent + "% done");
          // await prisma.streaming.update({
          //   where: { id: streaming.id },
          //   data: { status: "PROCESSING" },
          // });
        });

      cmd.run();
    });

  return { cmd, runStreaming };
};
