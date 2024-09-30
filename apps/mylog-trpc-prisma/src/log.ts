import { publicProcedure, router } from "./server/trpc";
import { PrismaClient } from "@prisma/client";
import z from "zod";

const prisma = new PrismaClient();

const logRouter = router({
  getPublics: publicProcedure
    .input(
      z.object({
        userid: z.number().optional(),
        skip: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ input }) => {
      return await prisma.log.findMany({
        where: {
          userid: input.userid,
        },
        skip: input.skip,
        take: input.limit,
      });
    }),
});

export default logRouter;
