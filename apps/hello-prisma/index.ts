import { PrismaClient } from "@prisma/client";
import { showUserInfo } from "./utils";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function main() {
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
