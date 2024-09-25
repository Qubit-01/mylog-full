import { PrismaClient } from "@prisma/client";
import { showUserInfo } from "./utils";
import dayjs from "dayjs";

const prisma = new PrismaClient();

async function main() {
  const user = await showUserInfo(64)
  console.log('🐔', dayjs(user?.createtime).format("YYYY-MM-DD HH:mm:ss"));
  
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
