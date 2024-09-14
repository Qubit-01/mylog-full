import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.log.findMany();
  console.log('🐔', prisma.user.count());
  
//   prisma.user.count();
  console.log(allUsers);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
