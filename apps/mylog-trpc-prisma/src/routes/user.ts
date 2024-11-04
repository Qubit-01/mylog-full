import { publicProcedure, router } from "../server/trpc";
import prisma from "../server";
import z from "zod";
import { getUserByPswd } from "@prisma/client/sql";
import { sign, verify } from "../utils/jwt";

const userRouter = router({
  /**
   * login 可以获取token的，getUser不行，目前token只包含id
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
      return sign(userid);
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
        const userid = verify(input.token);
        return prisma.userdata.findUnique({ where: { userid } });
      }
    }),
  /**
   * setUser 设置用户信息
   * @param token 用户token
   */
  setUser: publicProcedure
    .input(
      z.object({
        token: z.string(),
        data: z.object({
          img: z.string().optional(),
          info: z.string().optional(),
          setting: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ input }) => {
      const userid = verify(input.token);
      await prisma.userdata.update({
        where: { userid },
        data: input.data,
      });
    }),
  /**
   * setUserLogin 设置用户登录数据，pswd,unionid_qq,unionid_weixin
   * @param token
   */
  setUserLogin: publicProcedure
    .input(
      z.object({
        token: z.string(),
        unionidQq: z.string().optional(),
        unionidWeixin: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const userid = verify(input.token);
      await prisma.user.update({
        where: { id: userid },
        data: {
          unionid_qq: input.unionidQq,
          unionid_weixin: input.unionidWeixin,
        },
      });

    }),
});

export default userRouter;
