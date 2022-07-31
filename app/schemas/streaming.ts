import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";

const streamingSchema = z.object({
  videoUrl: zfd.text(
    z.string({ required_error: "Video URL is required" }).url()
  ),
  rtmps: zfd.text(z.string({ required_error: "RTMPs is required" }).url()),
  loop: zfd.numeric(
    z.number({ required_error: "Loop is required" }).min(-1).max(10)
  ),
});

export const streamingValidator = withZod(streamingSchema);
