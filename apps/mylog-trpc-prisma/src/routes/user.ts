import { publicProcedure, router } from "../server/trpc";
import prisma from "../server";
import z from "zod";
import jwt from "jsonwebtoken";
import { getUserByPswd } from "@prisma/client/sql";

const userRouter = router({
  /**
   * login 可以获取token的，getUser不行
   * @returns token，没有用户就返回undefined
   */
  getToken: publicProcedure
    .input(
      z.union([
        z.object({ unionidQq: z.string() }),
        z.object({ name: z.string(), pswd: z.string() }),
      ])
    )
    .query(async ({ input }) => {
      let userid: number;
      // 这里判断过后只会得到userid，没有就 0
      if ("unionidQq" in input) {
        userid =
          (
            await prisma.user.findUnique({
              select: { id: true },
              where: { unionid_qq: input.unionidQq },
            })
          )?.id || 0;
      } else if ("name" in input && "pswd" in input) {
        const user = (
          await prisma.$queryRawTyped(getUserByPswd(input.name, input.pswd))
        )[0];
        userid = user ? Number(user.userid) : 0;
      } else {
        userid = 0;
      }
      // 为0直接返回undefined，否则查询生成token
      if (!userid) return undefined;
      const userdata = await prisma.userdata.findUnique({ where: { userid } });
      return jwt.sign(
        { userid, name: userdata?.name },
        process.env.JwtSecretKey!,
        { expiresIn: process.env.JwtExpiresIn }
      );
    }),
  /**
   * getUser 获取用户信息，id>name>token
   * @param id 用户id
   * @param name 用户名
   * @param token 用户token
   */
  getUser: publicProcedure
    .input(
      z.union([
        z.object({ id: z.number() }),
        z.object({ name: z.string() }),
        z.object({ token: z.string() }),
      ])
    )
    .query(async ({ input }) => {
      if ("id" in input) {
        return prisma.userdata.findUnique({ where: { userid: input.id } });
      } else if ("name" in input) {
        return prisma.userdata.findUnique({ where: { name: input.name } });
      } else if ("token" in input) {
      }
    }),
});

export default userRouter;
