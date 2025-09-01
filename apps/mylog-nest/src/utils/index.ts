import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import dayjs from 'dayjs';
import type { log as LogPO } from '@prisma/client';
import { LogVO } from '@mylog-full/mix/src';
import { verify } from './jwt';

/**
 * 数据库转VO对象，主要后端用
 * PO to VO :
 *   1. JsonValue 转 对象
 *   2. Date 转 dayjs
 * @deprecated
 * @param log PO数据库对象 trpc直接返回的对象类型
 * @returns
 */
export const toLogVO4PO = (log: LogPO) => {
  const logVO: LogVO = {
    ...log,
    userid: log.userid,
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
};

/**
 * 注解: 获取请求的cookie的装饰器
 * @see https://docs.nestjs.com/techniques/cookies#creating-a-custom-decorator-cross-platform
 */
export const Cookies = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return key ? request.cookies?.[key] : request.cookies;
  },
);

/** 注解:从请求的 Cookie.token 中获取 Userid */
export const Userid = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('🔥 @Userid: token: ', request.cookies?.token);
    return verify(request.cookies?.token);
  },
);
