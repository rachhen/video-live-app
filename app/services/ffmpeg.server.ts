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

export const createLiveStream = (streaming: QueueData) => {
  return new Promise<Streaming>((resolve, reject) => {
    const resolution = resolutionsMap[streaming.resolution as Resolution];
    ffmpeg(`${directory}/${streaming.asset.path}`) //("./source.mp4"))
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
      .output(streaming.rtmps, { end: true })
      .on("start", async function (commandLine) {
        console.log("Spawned FFMPEG with command: " + commandLine);
        await prisma.streaming.update({
          where: { id: streaming.id },
          data: { status: "STARTED" },
        });
      })
      .on("error", async function (err) {
        await prisma.streaming.update({
          where: { id: streaming.id },
          data: { status: "ERROR" },
        });
        console.log("An error occurred: " + err.message);
        reject(err);
      })
      .on("end", async function () {
        const st = await prisma.streaming.update({
          where: { id: streaming.id },
          data: { status: "DONE" },
        });
        resolve(st);
      })
      .once("progress", async function (progress) {
        await prisma.streaming.update({
          where: { id: streaming.id },
          data: { status: "PROCESSING" },
        });
      })
      .run();
  });
};
