import {
  unstable_createFileUploadHandler,
  unstable_parseMultipartFormData,
} from "@remix-run/node"; // or cloudflare/deno
import slugify from "slugify";
import path from "path";
import { randomBytes } from "crypto";

export const uploadHandler = unstable_createFileUploadHandler({
  directory: "public/uploads",
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
