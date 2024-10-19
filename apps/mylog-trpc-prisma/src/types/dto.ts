import { AppRouter } from "../server";
import { createTRPCClient } from "@trpc/client";

type trpcClient = ReturnType<typeof createTRPCClient<AppRouter>>;

/** 为了绕开ts检测的权宜之计 */
type getRes<T> = NonNullable<T extends Promise<infer U> ? U : T>;

/**
 * LogDTO 里面时间是string
 */
export type LogDTO = getRes<
  ReturnType<trpcClient["log"]["getPublic"]["query"]>
>;

/**
 * UserDTO 里面时间是string
 */
export type UserDTO = getRes<
  ReturnType<trpcClient["user"]["getUser"]["query"]>
>;
