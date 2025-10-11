import { Body, Controller, Post } from '@nestjs/common';
import { LogService } from './log.service';
import { PrismaClient, Prisma } from '@prisma/client';
import { toWhere4LogFilter, Userid } from 'src/utils';
import { Log, LogFilter } from '@mylog-full/mix/src';
import { decrypt, encrypt } from 'src/utils/crypto';

@Controller('log')
export class LogController {
  constructor(
    private readonly logService: LogService,
    private readonly prisma: PrismaClient,
  ) {}

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
      include: { user: { select: { name: true } } },
      skip: body.skip,
      take: body.limit ?? 10,
      orderBy: { sendtime: 'desc' },
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
    console.log('🐔 get_mylogs: ', userid, JSON.stringify(body));
    if (!userid) return;

    const whereFilter = toWhere4LogFilter(body.filter);
    console.log('LSQ> whereFilter: ', JSON.stringify(whereFilter));

    return await this.prisma.log.findMany({
      where: { userid, ...whereFilter },
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

  /** 发布log，用token的userid，成功则返回删除的log，失败返回null */
  @Post('delete_log')
  async deleteLog(@Userid() userid: number, @Body() body: { id: number }) {
    console.log('🐔 delete_log: ', userid, body);
    if (!userid) return;

    const { id } = body;
    try {
      return await this.prisma.log.delete({ where: { id, userid } });
    } catch (e) {
      return;
    }
  }

  /** 分享加密 */
  @Post('encrypt_share')
  async encryptShare(
    @Userid() userid: number,
    @Body() body: { ids: number[] },
  ) {
    console.log('🐔 encrypt_share: ', userid, body);
    if (!userid) return;

    const idsReal = (
      await this.prisma.log.findMany({
        select: { id: true },
        where: { userid, id: { in: body.ids } },
      })
    ).map((log) => log.id);
    // console.log('LSQ< ', await decrypt(en));

    return await encrypt(idsReal);
  }

  /** 解密分享加密字符串，然后返回logs */
  @Post('get_share')
  async getShare(@Body() body: { skip: number; limit: number; share: string }) {
    console.log('🐔 get_share: ', body);

    const ids = await decrypt<number[]>(body.share);

    console.log('LSQ> ', ids);
    return await this.prisma.log.findMany({
      where: { id: { in: ids } },
      skip: body.skip,
      take: body.limit ?? 10,
      orderBy: { logtime: 'desc' },
    });
  }
}
