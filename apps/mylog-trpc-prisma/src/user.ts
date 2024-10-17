import { publicProcedure, router } from "./server/trpc";
import prisma from "./server";
import z from "zod";

const userRouter = router({
  /**
   * login 可以获取token的，getUser不行
   */
  login: publicProcedure
    .input(
      z.union([
        z.object({ name: z.string(), pswd: z.string() }),
        z.object({ unionidQq: z.string() }),
      ])
    )
    .query(async ({ input }) => {
      return 1;
      // return prisma.user.findUnique();
    }),
  getUser: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return prisma.userdata.findUnique({ where: { userid: input.id } });
    }),
  // userCreate: publicProcedure
  // 	// 这里用zod定义类型
  // 	.input(z.object({ name: z.string() }))
  // 	.mutation(async (opts) => {
  // 		const user = await db.user.create(opts.input);
  // 		return user;
  // 	}),
});

export default userRouter;
