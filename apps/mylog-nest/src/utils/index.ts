import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { log as LogPO } from '@prisma/client';
import { Log } from '@mylog-full/mix/src';
import { verify } from './jwt';

/**
 * 数据库转VO对象，主要后端用
 * PO to VO :
 *   - JsonValue 转 对象
 *   - Date 转 ISO字符串
 *   - 类型断言
 * @deprecated
 * @param log PO数据库对象 trpc直接返回的对象类型
 * @returns
 */
export const toLog4PO = (log: LogPO): Log => {
  const aLog: Log = {
    ...log,
    userid: log.userid,
    type: log.type as Log['type'],
    logtime: log.logtime.toISOString(),
    sendtime: log.sendtime.toISOString(),
    tags: log.tags as Log['tags'],
    imgs: log.imgs as Log['imgs'],
    videos: log.videos as Log['videos'],
    audios: log.audios as Log['audios'],
    files: log.files as Log['files'],
    location: log.location as Log['location'],
    people: log.people as Log['people'],
    info: log.info as Log['info'],
  };
  return aLog;
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
