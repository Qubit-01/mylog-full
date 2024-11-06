import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type AppRouter from "@mylog-full/mylog-trpc-prisma";

// 这里导入后端router，就能知道接口和输入输出类型
const trpc = createTRPCClient<AppRouter>({
  links: [
    // HTTP Batch Link 将多个请求合为一个http请求
    httpBatchLink({
      url: "https://mylog.cool:8080", // 本地代理
      // url: "https://www.mylog.cool:8080", // 公网
      // url: "http://localhost:8080", // 未SSL
    }),
  ],
});

export default trpc;
