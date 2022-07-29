import type { User } from "@prisma/client";
import { compare, hash } from "bcryptjs";
import { Authenticator } from "remix-auth";
import { FormStrategy } from "remix-auth-form";

import { getUserByEmail } from "~/models/user.server";
import type { RegisterInput } from "~/schemas/auth";
import { loginValidator } from "~/schemas/auth";
import { sessionStorage } from "~/services/session.server";
import { prisma } from "./db.server";

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
export const authenticator = new Authenticator<User>(sessionStorage);

authenticator.use(
  new FormStrategy(async ({ form }) => {
    const result = await loginValidator.validate(form);

    if (result.error) {
      throw new Error("Invalid credentials");
    }

    const user = await getUserByEmail(result.data.email);

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isMatch = await compare(result.data.password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const {
      password: _,
      verifyToken: __,
      resetPasswordToken: ___,
      ...rest
    } = user;

    return rest as User;
  }),
  "user-pass"
);

export const createUser = async (input: RegisterInput) => {
  const userExist = await getUserByEmail(input.email);

  if (userExist) {
    throw new Error("User already exists");
  }

  const hashedPassword = await hash(input.password, 10);
  // const verifyToken = randomUUID();

  const user = await prisma.user.create({
    data: { ...input, password: hashedPassword },
  });

  // sendMail({
  //   from: "noreply@rachhen.com",
  //   to: input.email,
  //   subject: "Verify your email",
  //   text: `Please verify your email by clicking on the link: ${process.env.FRONTEND_URL}/verify?token=${verifyToken}`,
  //   html: `<p>Please verify your email by clicking on the link: <a href="${process.env.FRONTEND_URL}/verify?token=${verifyToken}">Here</a></p>`,
  // });

  return user;
};
