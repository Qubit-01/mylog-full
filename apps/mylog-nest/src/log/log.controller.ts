import { Body, Controller, Post } from '@nestjs/common';
import { LogService } from './log.service';
import { PrismaClient, Prisma } from '@prisma/client';
import { Userid } from 'src/utils';
import { Log, LogFilter } from '@mylog-full/mix/src';

@Controller('log')
export class LogController {
  constructor(
    private readonly logService: LogService,
    private readonly prisma: PrismaClient,
  ) {}

  /**
   * 获取单个public，没有返回null
   * @param id log的id
   */
  @Post('get_public')
  async getPublic(@Body() body: { id: number }) {
    console.log('🐔 get_public: ', body);

    const log = await this.prisma.log.findUnique({
      where: { id: body.id, type: 'public' },
    });
    return log;
  }

  /**
   * 获取public列表， 按发送时间倒序
   * @param userid 用户id
   * @param skip 跳过多少条
   * @param limit 取多少条
   */
  @Post('get_publics')
  async getPublics(
    @Body() body: { userid?: number; skip: number; limit: number },
  ) {
    console.log('🐔 get_publics: ', body);

    const logs = await this.prisma.log.findMany({
      where: { userid: body.userid, type: 'public' },
      skip: body.skip,
      take: body.limit ?? 10,
      orderBy: {
        sendtime: 'desc',
      },
    });
    return logs;
  }

  /**
   * 获取mylog列表， 按记录时间倒序
   * @param userid 用户id
   * @param skip 跳过多少条
   * @param limit 取多少条
   */
  @Post('get_mylogs')
  async getMylogs(
    @Userid() userid: number,
    @Body() body: { skip: number; limit: number; filter?: LogFilter },
  ) {
    console.log('🐔 get_mylogs: ', userid, body);
    if (!userid) return;

    // 构造 where 条件
    const { filter } = body;
    const whereFilter: Prisma.logWhereInput = {};
    if (filter) {
      if (filter.type) whereFilter.type = filter.type;
      if (filter.logtime) {
        whereFilter.logtime = {};
        filter.logtime.gte &&
          (whereFilter.logtime.gte = new Date(filter.logtime.gte));
        filter.logtime.lte &&
          (whereFilter.logtime.lte = new Date(filter.logtime.lte));
      }
      //   if (filter.content)
      //     whereFilter.content = { search: filter.content.include.join(' | ') };
      //   if (filter.people)
      //     whereFilter.people = { array_contains: filter.people.include };
      //   if (filter.tags)
      //     whereFilter.tags = { array_contains: filter.tags.include };
      //   if (filter.exclude) whereFilter.id = { notIn: filter.exclude };
    }

    console.log('LSQ> whereFilter: ', whereFilter);

    return await this.prisma.log.findMany({
      where: {
        userid,
        ...whereFilter,
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
      },
      skip: body.skip,
      take: body.limit ?? 10,
      orderBy: { logtime: 'desc' },
    });
  }

  /** 发布log，用token的userid */
  @Post('release_log')
  async releaseLog(@Userid() userid: number, @Body() body: { log: Log }) {
    console.log('🐔 release_log: ', userid, body);
    if (!userid) return;

    const { log } = body;
    return await this.prisma.log.create({
      data: {
        userid: log.userid ?? userid,
        type: log.type ?? 'log',
        content: log.content ?? '',
        tags: log.tags ?? [],
        imgs: log.imgs ?? [],
        videos: log.videos ?? [],
        audios: log.audios ?? [],
        files: log.files ?? [],
        location: log.location ?? [],
        people: log.people ?? [],
        info: log.info ?? {},
        sendtime: new Date(),
        logtime: new Date(log.logtime ?? Date.now()),
      },
    });
  }
}
