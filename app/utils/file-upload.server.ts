import path from "path";
import { constants } from "fs";
import fs from "fs/promises";
import { randomBytes } from "crypto";
import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"; // or cloudflare/deno
import slugify from "slugify";

export const directory = "public/uploads";

export const uploadHandler = unstable_createFileUploadHandler({
  directory,
  maxPartSize: 1073741824,
  file: (args) => {
    const slug = slugify(args.filename, { lower: true });
    const parsedSlug = path.parse(slug);
    const genKey = randomBytes(5).toString("hex");
    return `${parsedSlug.name}-${genKey}${parsedSlug.ext}`;
  },
});

export const fileUpload = (request: Request): Promise<FormData> => {
  return unstable_parseMultipartFormData(request, uploadHandler);
};

export const deleteFile = async (filePath: string) => {
  const file = `${directory}/${filePath}`;

  return checkFileExist(file).then((exists) => {
    if (exists) {
      return fs.unlink(file);
    }
  });
};

async function checkFileExist(file: string) {
  return fs
    .access(file, constants.F_OK)
    .then(() => true)
    .catch(() => false);
}
