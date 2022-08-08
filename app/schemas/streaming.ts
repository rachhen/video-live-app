import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";

const streamingSchema = z.object({
  name: zfd.text(z.string({ required_error: "Name is required" })),
  videoId: zfd.text(z.string({ required_error: "Video is required" })),
  rtmps: zfd.text(z.string({ required_error: "RTMPs is required" }).url()),
  loop: zfd.numeric(
    z.number({ required_error: "Loop is required" }).min(-1).max(10)
  ),
});

export const streamingValidator = withZod(streamingSchema);
export type StreamingInput = z.infer<typeof streamingSchema>;
