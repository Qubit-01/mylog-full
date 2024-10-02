import type { AppRouter } from "./src/server";

export type {
  user as User,
  userdata as Userdata,
  log as Log,
  relation as Relation,
} from "@prisma/client";

export default AppRouter;
