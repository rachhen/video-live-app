import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";

const loginSchema = z.object({
  email: zfd.text(z.string({ required_error: "Email is required" }).email()),
  password: zfd.text(z.string({ required_error: "Password is required" })),
});

const registerSchema = z
  .object({
    name: zfd.text(z.string({ required_error: "Name is required" })),
  })
  .merge(loginSchema);

export const loginValidator = withZod(loginSchema);
export const registerValidator = withZod(registerSchema);

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
