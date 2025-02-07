import { Body, Controller, Post } from '@nestjs/common';
import { LogService } from './log.service';
import { PrismaClient } from '@prisma/client';
import { Cookies } from 'src/utils';
import { verify } from 'src/utils/jwt';

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
    console.log('🐔', JSON.stringify(body));

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
    @Cookies('token') token: string,
    @Body() body: { skip: number; limit: number },
  ) {
    const userid = verify(token);
    console.log('🐔', userid, body);

    const logs = await this.prisma.log.findMany({
      where: { userid },
      skip: body.skip,
      take: body.limit ?? 10,
      orderBy: { logtime: 'desc' },
    });
    return logs;
  }
}
