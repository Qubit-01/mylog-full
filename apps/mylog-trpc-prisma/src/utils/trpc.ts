import { initTRPC } from "@trpc/server";

/** 初始化TRPC后端，并且保证是单例模式（只导出方法） */
const t = initTRPC.create();

/** 导出路由和过程调用 */
export const router = t.router;
export const publicProcedure = t.procedure;