import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type AppRouter from "@mylog-full/mylog-trpc-prisma";

// 这里导入后端router，就能知道接口和输入输出类型
const trpc = createTRPCClient<AppRouter>({
  links: [
    // HTTP Batch Link 将多个请求合为一个http请求
    httpBatchLink({
      url: "http://localhost:8080",
    }),
  ],
});

export default trpc;

// export const getPublics = async (params: {
//   skip: number;
//   limit: number;
//   userid?: number | undefined;
// }): Promise<Log[]> => {
//   const rawLogs = await trpc.log.getPublics.query(params);
//   // csl
//   rawLogs[0].logtime;
//   return rawLogs.map(handleLog);
// };