import { createHTTPServer } from "@trpc/server/adapters/standalone";
import { PrismaClient } from "@prisma/client";
import { router } from "./trpc";
import user from "../user";
import log from "../log";

/** 总路由 */
const appRouter = router({ user, log });

// 导出路由的类型，给client指路，而不是路由本身
export type AppRouter = typeof appRouter;

const server = createHTTPServer({ router: appRouter });

server.listen(8080);

console.log('🐔tRPC Server 启动！ 8080');

const prisma = new PrismaClient();

// prisma.$extends({
//     result: {
//         $allModels: {
//             $allFieds: {

//             }
//         }
//     }
// })

export default prisma;