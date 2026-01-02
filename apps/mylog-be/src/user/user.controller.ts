import { Controller, Post, Body, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { prisma } from '../../lib/prisma';
import { getUseridByPswd } from 'generated/prisma/sql';
import { sign } from 'src/utils/jwt';
import { Userid } from 'src/utils';
import { type User } from '@mylog-full/mix';
import dayjs from 'dayjs';
import { type Response } from 'express';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * 获取token。用于登录，getUser不行，目前token只包含id信息
   * @param body unionidQq > name+pswd
   * @returns 用户token，错误返回undefined
   */
  @Post('token')
  async getToken(
    @Body() body: { unionidQq: string } | { name: string; pswd: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('🐔 token: ', body);

    let userid: number | undefined;
    if ('unionidQq' in body)
      userid = await this.getUseridByUnionidQq(body.unionidQq);
    else if ('name' in body)
      userid = await this.getUseridByPswd(body.name, body.pswd);

    const token = userid ? sign(userid) : undefined;
    console.log('LSQ> token', token);

    if (token) {
      res.cookie('token', token, {
        maxAge: 60 * 60 * 24 * 60 * 1000, // 两个月,ms
        // httpOnly: true, // 仅请求可访问，js不可访问
        secure: process.env.NODE_ENV === 'production', // 仅 https 传输
        // sameSite: 'strict', // 防止CSRF攻击和用户追踪
        domain: '.mylog.ink', // 二级域名共享
        // path: '/',
        // signed: true,
      });
    }

    return token;
  }

  /**
   * 获取用户信息，id > name > token
   * @param id 用户ID
   * @param name 用户名
   * @param token 用户token
   * @returns 用户信息
   */
  @Post('get_user')
  async getUser(
    @Userid() userid: number,
    @Body() body?: { id: number } | { name: string },
  ) {
    console.log('🐔 get_user: ', userid, body);

    let user;
    if (body && 'id' in body)
      user = await prisma.user.findUnique({ where: { userid: body.id } });
    else if (body && 'name' in body)
      user = await prisma.user.findUnique({ where: { name: body.name } });
    else if (userid) user = await prisma.user.findUnique({ where: { userid } });

    if (!user) return;

    const setting = user.setting as User['setting'];

    // 覆盖算法
    return {
      id: user.userid ?? 0, // ⚠️这里要用userid，不能用id
      name: user.name ?? '',
      img: user.img ?? '',
      info: user.info ?? {},
      createtime: user.createtime ?? dayjs().valueOf(),
      setting: {
        page: {
          theme: setting?.page?.theme ?? 'light',
        },
        mylog: {
          tags: setting?.mylog?.tags ?? [],
          filters: setting?.mylog?.filters ?? [],
          filterIndex: setting?.mylog?.filterIndex ?? 0,
          calendarTags: setting?.mylog?.calendarTags ?? [],
        },
        map: {
          diyPoints: setting?.map?.diyPoints ?? [],
        },
      },
    };
  }

  /**
   * 设置用户信息
   * @param token 用户令牌，
   * @param data 要设置的数据。目前只能设置img/info/setting
   */
  @Post('set_user')
  async setUser(
    @Userid() userid: number,
    @Body()
    body: { img?: string; info?: string; setting?: string },
  ) {
    console.log('🐔 set_user: ', userid, body);
    if (!userid) return;
    await prisma.user.update({
      where: { userid },
      data: body,
    });
    return 1;
  }

  /**
   * 设置用户登录数据
   * @param token 用户令牌
   * @param unionidQq QQ的unionid
   * @param unionidWeixin 微信的unionid
   */
  @Post('set_userlogin')
  async setUserLogin(
    @Userid() userid: number,
    @Body() body: { unionidQq?: string; unionidWeixin?: string },
  ) {
    console.log('🐔 set_userlogin: ', userid, body);
    if (!userid) return;
    await prisma.userlogin.update({
      where: { id: userid },
      data: {
        unionid_qq: body.unionidQq,
        unionid_weixin: body.unionidWeixin,
      },
    });
    return 1;
  }

  /**
   * 获取用户id
   * @param body 用户名&密码
   * @returns 用户id
   */
  async getUseridByPswd(name: string, pswd: string) {
    const user = (await prisma.$queryRawTyped(getUseridByPswd(name, pswd)))[0];
    return user ? Number(user.id) : undefined;
  }

  /**
   * 获取用户id
   * @param unionidQq QQ的unionid
   * @returns 用户id
   */
  async getUseridByUnionidQq(unionidQq: string) {
    return (
      await prisma.userlogin.findUnique({
        select: { id: true },
        where: { unionid_qq: unionidQq },
      })
    )?.id;
  }
}
