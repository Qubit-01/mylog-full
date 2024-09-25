import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
const prisma = new PrismaClient();

/**
 * 创建 user , 并递归创建 userdata
 */
export const createUser = async () => {
  const res = await prisma.user.create({
    data: {
      name: "四川农业大学",
      pswd: "a47eb6322993682b61e8499c3aa46af1f788724e",
      userdata: {
        create: {
          name: "四川农业大学",
          img: "https://qlogo4.store.qq.com/qzone/3505457127/3505457127/100?1670415293",
          info: {
            text: "https://user.qzone.qq.com/3505457127",
            birth: "1906-06-01",
          },
          setting: {},
          // createtime: dayjs(
          //   "2023-04-07 10:20:33",
          //   "YYYY-MM-DD HH:mm:ss"
          // ).toDate(), // "2023-04-07 102033+8",
        },
      },
    },
  });
  console.dir(res, { depth: null });
};

/**
 * 创建 user , 并递归创建 userdata
 */
export const showUserInfo = async (id: number) => {
  const user = await prisma.userdata.findUnique({
    where: { id },
  });
  console.dir(user, { depth: null });
  return user;
};

export const test = async () => {
  // Date 模式
  // const createtime = new Date(); // 2024-09-25T06:29:53.279Z
  const createtime = new Date("2023-04-07 10:20:33"); // 2023-04-07 10:20:33
  // const createtime = new Date(Date.UTC(2024, 8, 25, 14, 29, 53)); // 2024-09-25T14:29:53.000Z
  // const createtime = new Date(2024, 8, 25, 14, 29, 53); // 2024-09-25T14:29:53.000Z
  // const createtime = new Date().toISOString(); // 2024-09-20T05:29:49.922Z
  console.log("🐔传入的时间", createtime);
  await prisma.userdata.update({
    where: { id: 4 },
    data: {
      createtime,
    },
  });

  const user = await prisma.userdata.findUnique({
    where: { id: 4 },
  });

  const t = user?.createtime!;

  console.log("🐔", t);
  console.log("🐔", dayjs(user?.createtime).toISOString());
  console.log(
    "🐔获取的时间",
    dayjs(user?.createtime).format("YYYY-MM-DD HH:mm:ss")
  );
};
