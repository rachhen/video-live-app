import path from "path";
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

export const fileUpload = (request: Request) => {
  return unstable_parseMultipartFormData(request, uploadHandler);
};

export const deleteFile = (filePath: string) => {
  return fs.unlink(`${directory}/${filePath}`);
};
