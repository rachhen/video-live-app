import ffmpeg from "fluent-ffmpeg";

// ffmpeg -re -y -i source.mp4 -c:a copy -ac 1 -ar 44100 -b:a 96k -vcodec libx264 -pix_fmt yuv420p -vf scale=1080:-1 -r 30 -g 60 -tune zerolatency -f flv -maxrate 2000k -preset veryfast "rtmps://live-api-s.facebook.com:443/rtmp/FB-778095353621857-0-AbzVlwh1th8pcDBJ"
ffmpeg("./source.mp4")
  .inputOptions("-re")
  .inputOptions("-y")
  .inputOption("-stream_loop", "-1")
  .size("1080x?")
  .audioCodec("libmp3lame")
  .audioCodec("copy")
  .audioChannels(2)
  .audioBitrate(128)
  .videoCodec("libx264")
  .videoBitrate(1024)
  .addOption("-pix_fmt", "yuv420p")
  .addOption("-vf", "scale=1080:-1")
  .addOption("-r", "30")
  .addOption("-g", "60")
  .addOption("-tune", "zerolatency")
  .addOption("-f", "flv")
  .addOption("-maxrate", "2000k")
  .addOption("-preset", "veryfast")
  .output(
    "rtmps://live-api-s.facebook.com:443/rtmp/FB-778095353621857-0-AbzVlwh1th8pcDBJ",
    { end: true }
  )
  .on("start", function (commandLine) {
    console.log("Spawned FFMPEG with command: " + commandLine);
  })
  .on("error", function (err) {
    console.log("An error occurred: " + err.message);
  })
  .on("end", function () {
    console.log("Finished processing");
  })
  .on("progress", function (progress) {
    console.log("Processing: " + progress.percent + "% done");
  })
  .run();
