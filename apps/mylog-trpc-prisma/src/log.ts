import { publicProcedure, router } from "./server/trpc";
import prisma from "./server";
import z from "zod";

const logRouter = router({
  getPublic: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const log = await prisma.log.findUnique({
        where: { id: input.id, type: "public" },
      });
      return log;
    }),
  getPublics: publicProcedure
    .input(
      z.object({
        userid: z.number().optional(),
        skip: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ input }) => {
      const logs = await prisma.log.findMany({
        where: { userid: input.userid, type: "public" },
        skip: input.skip,
        take: input.limit,
        orderBy: {
          sendtime: "desc",
        },
      });
      return logs;
    }),
});

export default logRouter;
