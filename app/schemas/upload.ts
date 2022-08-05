import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { NodeOnDiskFile } from "@remix-run/node";

const uploadSchema = zfd.formData({
  file: zfd.file(z.instanceof(NodeOnDiskFile)),
});

export const uploadValidator = withZod(uploadSchema);

export type UploadInput = z.infer<typeof uploadSchema>;
