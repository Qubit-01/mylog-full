import type { AppRouter } from "./src/server";

export type {
  user as DbUser,
  userdata as DbUserdata,
  log as DbLog,
  relation as DbRelation,
} from "@prisma/client";

export default AppRouter;
