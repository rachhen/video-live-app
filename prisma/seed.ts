import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await prisma.user.deleteMany({});

  const hashedPassword = await hash("123456", 10);
  await prisma.user.create({
    data: {
      email: "woufo@aol.com",
      password: hashedPassword,
      name: "Woufo Dev",
    },
  });
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
