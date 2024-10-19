import type { LogDTO, LogVO } from "@mylog-full/mylog-trpc-prisma";
import dayjs from "dayjs";

/**
 * PO > DTO > VO
 * 目的：前后端都用VO的方式处理业务
 */

/**
 * log DTO to VO
 * 经过了网络传输，时间会变成字符串，需要转回来
 * 1. 时间string 转 dayjs
 * @param log DTO数据传输对象
 * @returns LogVO
 */
export function toLogVO4DTO(log: LogDTO): LogVO {
  const logVO: LogVO = {
    ...log,
    sendtime: dayjs(log.sendtime),
    logtime: dayjs(log.logtime),
  };

  return logVO;
}
