import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { PrismaClient } from "@prisma/client";
import { router } from "./trpc";
import user from "../routes/user";
import log from "../routes/log";

/** 总路由 */
const appRouter = router({ user, log });

// 导出路由的类型，给client指路，而不是路由本身
export type AppRouter = typeof appRouter;

const server = createHTTPServer({ router: appRouter });

server.listen(8080);

console.log("🐔tRPC Server 启动！ 8080");

/**
 * PrismClient 应该是单例的
 */
const prisma = new PrismaClient();

export default prisma;
