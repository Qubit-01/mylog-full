/**
 * 数据库模型
 * Persistent Object 持久化对象
 * 与数据表一致的类型
 */
export {
    user as UserPO,
    userdata as UserdataPO,
    log as LogPO,
    relation as RelationPO,
  } from "@prisma/client";

// DTO 数据传输对象
export * from "./dto";

// VO 前端视图对象
export * from "./vo";


