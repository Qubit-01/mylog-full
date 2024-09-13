import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../server";

// 这里导入后端router，就能知道接口和输入输出类型
const trpc = createTRPCClient<AppRouter>({
  links: [
    // HTTP Batch Link 将多个请求合为一个http请求
    httpBatchLink({ url: "http://localhost:3000" }),
  ],
});

export default trpc;

async function main() {
  const user = await trpc.userById.query("1");

  console.log("🐔", user);

  const createUser = await trpc.userCreate.mutate({ name: "lsq" });

  console.log("🐔", createUser);

  const userList = await trpc.userList.query();

  console.log('🐔', userList);
  
}

main()