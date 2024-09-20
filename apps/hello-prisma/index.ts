import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import { env } from "node:process";
env.TZ = "Asia/Shanghai";

const prisma = new PrismaClient();

async function main() {
  // const allUsers = await prisma.userdata.findMany();
  // console.dir(allUsers, { depth: null });
  // const createtime = "2023-04-07T10:20:33Z";
  // const createtime = dayjs().toISOString();
  // const createtime = new Date(2024, 4, 7, 10, 20, 33);
  // const createtime = dayjs().toISOString();
  // const createtime = new Date(Date.UTC(2024, 5, 7, 10, 20, 33));
  // const createtime = new Date(); // 2024-09-20T05:29:49.922Z
  // console.log("🐔", createtime);
  // await prisma.userdata.update({
  //   where: {
  //     id: 4,
  //   },
  //   data: {
  //     createtime,
  //   },
  // });

  const user = await prisma.userdata.findUnique({
    where: {
      id: 6,
    },
  });

  const t = user?.createtime!

  console.log("🐔", t);
  console.log("🐔", dayjs(user?.createtime).toISOString());
  console.log("🐔", dayjs(user?.createtime).format('YYYY-MM-DD HH:mm:ss'));

  // const res = await prisma.user.create({
  //   data: {
  //     name: "test",
  //     pswd: "a47eb6322993682b61e8499c3aa46af1f788724e",
  //     userdata: {
  //       create: {
  //         name: "test",
  //         img: "http://tiebapic.baidu.com/forum/pic/item/41ab3bc7a7efce1ba1eb1216ea51f3deb68f65f4.jpg?tbpicau=2022-10-19-05_cc77589655f98f3787dfd2d70adca6c4",
  //         info: {},
  //         setting: {},
  //         // createtime: dayjs(
  //         //   "2023-04-07 10:20:33",
  //         //   "YYYY-MM-DD HH:mm:ss"
  //         // ).toDate(), // "2023-04-07 102033+8",
  //       },
  //     },
  //   },
  // });
  // console.dir(res, { depth: null });
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
