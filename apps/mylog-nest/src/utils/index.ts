import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import dayjs from 'dayjs';
import type { log as LogPO } from '@prisma/client';
import { LogVO } from '@mylog-full/mix/types';

/**
 * 数据库转VO对象，主要后端用
 * PO to VO :
 *   1. JsonValue 转 对象
 *   2. Date 转 dayjs
 * @deprecated
 * @param log PO数据库对象 trpc直接返回的对象类型
 * @returns
 */
export function toLogVO4PO(log: LogPO): LogVO {
  const logVO: LogVO = {
    ...log,
    userid: log.userid || undefined,
    type: log.type as LogVO['type'],
    logtime: dayjs(log.logtime),
    sendtime: dayjs(log.sendtime),
    tags: log.tags as LogVO['tags'],
    imgs: log.imgs as LogVO['imgs'],
    videos: log.videos as LogVO['videos'],
    audios: log.audios as LogVO['audios'],
    files: log.files as LogVO['files'],
    location: log.location as LogVO['location'],
    people: log.people as LogVO['people'],
    info: log.info as LogVO['info'],
  };
  return logVO;
}

/**
 * 获取请求的cookie的装饰器
 * @see https://docs.nestjs.com/techniques/cookies#creating-a-custom-decorator-cross-platform
 */
export const Cookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] : request.cookies;
  },
);
