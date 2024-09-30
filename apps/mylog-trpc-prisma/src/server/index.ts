import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { router } from "./trpc";
import user from "../user";
import log from "../log";

/** 总路由 */
const appRouter = router({ user, log });

// 导出路由的类型，给client指路，而不是路由本身
export type AppRouter = typeof appRouter;

const server = createHTTPServer({ router: appRouter });

server.listen(3000);

console.log('🐔tRPC Server 启动！ 3000');
