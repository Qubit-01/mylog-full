import type { LogDTO, LogPO, LogVO } from "../types";
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
export const toLogVO4DTO = (log: LogDTO): LogVO => {
  const logVO: LogVO = {
    ...log,
    sendtime: dayjs(log.sendtime),
    logtime: dayjs(log.logtime),
  };

  return logVO;
};

/**
 * 数据库转前端对象
 * PO to VO :
 *   1. JsonValue 转 对象
 *   2. Date 转 dayjs
 * @param log PO数据库对象 trpc直接返回的对象类型
 * @returns
 */
export const toLogVO4PO = (log: LogPO): LogVO => {
  const logVO: LogVO = {
    ...log,
    userid: log.userid || undefined,
    type: log.type as LogVO["type"],
    logtime: dayjs(log.logtime),
    sendtime: dayjs(log.sendtime),
    tags: log.tags as LogVO["tags"],
    imgs: log.imgs as LogVO["imgs"],
    videos: log.videos as LogVO["videos"],
    audios: log.audios as LogVO["audios"],
    files: log.files as LogVO["files"],
    location: log.location as LogVO["location"],
    people: log.people as LogVO["people"],
    info: log.info as LogVO["info"],
  };
  return logVO;
};
