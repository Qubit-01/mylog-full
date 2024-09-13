import trpc from "./client";

const user = await trpc.userById.query("1");

console.log("🐔", user);

const createUser = await trpc.userCreate.mutate({ name: "lsq" });

console.log("🐔", createUser);

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <h1>tRPC项目</h1>
  </div>
`;

document.querySelector<HTMLButtonElement>("#counter");
