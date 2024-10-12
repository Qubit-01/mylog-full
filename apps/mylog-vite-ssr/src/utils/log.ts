import type { Log } from "@/types";

/**
 * 将后端回传的log进行处理，其中的属性加工为前端需要的东西
 *
 * @param log
 */
export const handleLog = (log: any): Log => {
  return log as Log;
};
