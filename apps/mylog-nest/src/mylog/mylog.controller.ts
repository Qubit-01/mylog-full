import { Body, Controller, Post } from '@nestjs/common';
import { MylogService } from './mylog.service';
import { PrismaClient } from '@prisma/client';
import { toLogVO4PO } from 'src/utils';

@Controller('mylog')
export class MylogController {
  constructor(
    private readonly mylogService: MylogService,
    private readonly prisma: PrismaClient,
  ) {}

  /**
   * 获取token。用于登录，getUser不行，目前token只包含id信息
   * @param body unionidQq > name+pswd
   * @returns 用户token
   */
  @Post('get_public')
  async getPublic(@Body() body: { id: number }) {
    const log = await this.prisma.log.findUnique({
      where: { id: body.id, type: 'public' },
    });
    return log && toLogVO4PO(log);
    // return log;
  }
}
