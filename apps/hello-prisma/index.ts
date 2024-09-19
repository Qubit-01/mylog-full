import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const allUsers = await prisma.user.findMany();
  console.log('🐔', allUsers);
  
//   const res = await prisma.user.create({
//     data: {name: 'lsq'}
//   });
//   const res = await prisma.user.update({
//     where: {id: 1},
//     data: {name: 'lsq'}
//   });
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });