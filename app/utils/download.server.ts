import fs from "fs";
import path from "path";
import http from "http";
import https from "https";

export const getClient = (url: string) => {
  if (url.startsWith("https")) {
    return https;
  }

  return http;
};

export const downloadFile = (url: string, fileName: string) => {
  return new Promise((resolve, reject) => {
    const client = getClient(url);

    const tmpPath = path.join(__dirname, "../runtime", fileName);
    const file = fs.createWriteStream(tmpPath);

    client.get(url, (response) => {
      response.pipe(file);
    });

    file.on("finish", () => {
      file.close();
      resolve(tmpPath);
    });

    file.on("error", (err) => {
      reject(err);
    });
  });
};
