import { publicProcedure, router } from '../utils/trpc'
import prisma from '../utils/prisma'
import z from 'zod'
import { toLogVO4PO } from '../utils'

const logRouter = router({
  /**
   * 获取单个public，没有返回null
   * @param id log的id
   */
  getPublic: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const log = await prisma.log.findUnique({
        where: { id: input.id, type: 'public' },
      })
      return log && toLogVO4PO(log)
      // return log;
    }),
  /**
   * 获取public列表， 按发送时间倒序
   * @param userid 用户id
   * @param skip 跳过多少条
   * @param limit 取多少条
   */
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
        where: { userid: input.userid, type: 'public' },
        skip: input.skip,
        take: input.limit,
        orderBy: {
          sendtime: 'desc',
        },
      })
      return logs.map(toLogVO4PO)
    }),
  /**
   * 获取mylog列表， 按记录时间倒序
   * @param userid 用户id
   * @param skip 跳过多少条
   * @param limit 取多少条
   */
  getMylogs: publicProcedure
    .input(
      z.object({
        userid: z.number().optional(),
        skip: z.number(),
        limit: z.number(),
      })
    )
    .query(async ({ input }) => {
      const logs = await prisma.log.findMany({
        where: { userid: input.userid },
        skip: input.skip,
        take: input.limit,
        orderBy: {
          logtime: 'desc',
        },
      })
      return logs.map(toLogVO4PO)
    }),
})

export default logRouter
