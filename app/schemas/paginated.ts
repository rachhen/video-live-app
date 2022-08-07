import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import type { z } from "zod";

const paginatedSchema = zfd.formData({
  page: zfd.numeric().optional().default(0),
  limit: zfd.numeric().optional().default(15),
});

export const pagiatedValidator = withZod(paginatedSchema);

export type Paginated = z.infer<typeof paginatedSchema>;
