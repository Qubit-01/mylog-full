import { publicProcedure, router } from "./server/trpc";
import { PrismaClient } from "@prisma/client";
import z from "zod";

const prisma = new PrismaClient();

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

  // /** 查询用户s */
  // userList: publicProcedure.query(async () => {
  // 	return await db.user.findMany();
  // }),
  // /** 通过ID查用户，id是string类型 */
  // userById: publicProcedure
  // 	// 这里进行请求参数的验证(可以省略)，可以用一些验证库zod
  // 	// 这时val是unkown类型的，因为无法确定client发来的数据
  // 	.input((val: unknown) => {
  // 		// 如果是字符串类型，就返回。这时后面的会自动推断类型了
  // 		if (typeof val === "string") return val;
  // 		// 如果不是预期类型，就抛出一个错误，不再继续执行
  // 		throw new Error(`Invalid input: ${typeof val}`);
  // 	})
  // 	.query(async (opts) => {
  // 		// input被推断为string类型
  // 		return await db.user.findById(opts.input);
  // 	}),
  // userCreate: publicProcedure
  // 	// 这里用zod定义类型
  // 	.input(z.object({ name: z.string() }))
  // 	.mutation(async (opts) => {
  // 		const user = await db.user.create(opts.input);
  // 		return user;
  // 	}),
});

export default userRouter;
