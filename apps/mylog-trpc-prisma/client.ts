import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "./src/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 这里导入后端router，就能知道接口和输入输出类型
const trpc = createTRPCClient<AppRouter>({
  links: [
    // HTTP Batch Link 将多个请求合为一个http请求
    httpBatchLink({ url: "http://localhost:3000" }),
  ],
});

console.log("🐔tRPC Client 启动！");

export default trpc;

// 这里就是测试DEMO
// 就是调用接口了，由页面自行调用了
async function main() {
  const logs = await trpc.log.getPublics.query({
    userid: 2,
    skip: 0,
    limit: 1,
  });
  console.log("🐔", logs);
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
