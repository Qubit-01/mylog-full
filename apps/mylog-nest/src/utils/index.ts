import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { log as LogPO, Prisma } from '@prisma/client';
import { Log, LogFilter } from '@mylog-full/mix/src';
import { verify } from './jwt';

/**
 * 数据库转VO对象，主要后端用
 * PO to VO :
 *   - JsonValue 转 对象
 *   - Date 转 ISO字符串
 *   - 类型断言
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
    if (!request.cookies?.token) console.log('🔥 @UserId: 未携带 token');
    return verify(request.cookies?.token);
  },
);

/** 前端的 filter 转为 where 条件 */
export const toWhere4LogFilter = (filter?: LogFilter) => {
  if (!filter) return undefined;

  // type: 'log',
  // logtime: {
  //   gte: new Date('2000-01-01T00:00:00.000Z'),
  //   lte: new Date(),
  // },
  // content: {
  //   search: 'adwdwd',
  // contains: '获取位置和',
  // },
  // people: {
  //   array_contains: ['张三'],
  // },
  // tags: {
  //   array_contains: ['标签1'],
  // },
  // id: {
  //   notIn: [2871, 2, 3],
  // },

  const where: Prisma.logWhereInput = {};
  // 1. type 限制
  if (filter.type) where.type = filter.type;
  // 2. 时间范围限制
  if (filter.logtime.gte || filter.logtime.lte) {
    where.logtime = {};
    filter.logtime.gte && (where.logtime.gte = new Date(filter.logtime.gte));
    filter.logtime.lte && (where.logtime.lte = new Date(filter.logtime.lte));
  }

  const conditions: Prisma.logWhereInput[] = [];

  // 3. 内容包含
  if (filter.content.contains.length) {
    const c = filter.content.contains.map((t) => ({
      content: { contains: t },
    }));
    if (filter.content.isOr) conditions.push({ OR: c });
    else conditions.push(...c);
  }
  // 4. 人员包含
  if (filter.people.contains.length) {
    const c = filter.people.contains.map((t) => ({
      people: { array_contains: [t] },
    }));
    if (filter.people.isOr) conditions.push({ OR: c });
    else conditions.push(...c);
  }
  // 5. 标签包含
  if (filter.tags.contains.length) {
    const c = filter.tags.contains.map((t) => ({
      tags: { array_contains: [t] },
    }));
    if (filter.tags.isOr) conditions.push({ OR: c });
    else conditions.push(...c);
  }

  if (conditions.length) {
    where[filter.isOrAll ? 'OR' : 'AND'] = conditions;
  }
  // 6. 排除id
  if (filter.exclude.length) where.id = { notIn: filter.exclude };

  return where;
};
