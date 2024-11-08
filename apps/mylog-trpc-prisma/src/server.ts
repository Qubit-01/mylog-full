import { createHTTPHandler } from "@trpc/server/adapters/standalone";
import { router } from "./utils/trpc";
import https from "https";
import fs from "fs";
import user from "./routes/user";
import log from "./routes/log";
import test from "./routes/test";

/** 总路由 */
const appRouter = router({ user, log, test });

// 导出路由的类型，给client指路，而不是路由本身
export type AppRouter = typeof appRouter;

// const server = createHTTPServer({ router: appRouter });
const server = https.createServer(
  {
    key: fs.readFileSync("./cert/mylog.cool.key", "utf-8"),
    cert: fs.readFileSync("./cert/mylog.cool.crt", "utf-8"),
  },
  createHTTPHandler({ router: appRouter })
);

server.listen(8080);

console.log("🐔tRPC Server 启动！ 8080");
