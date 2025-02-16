import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { getUseridByPswd } from '@prisma/client/sql';
import { PrismaClient } from '@prisma/client';
import { sign } from 'src/utils/jwt';
import { Userid } from 'src/utils';
import { type UserVO } from '@mylog-full/mix/types';
import dayjs from 'dayjs';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaClient,
  ) {}

  /**
   * 获取token。用于登录，getUser不行，目前token只包含id信息
   * @param body unionidQq > name+pswd
   * @returns 用户token
   */
  @Post('token')
  async getToken(
    @Body() body: { unionidQq: string } | { name: string; pswd: string },
  ) {
    console.log('🐔 token: ', body);

    let userid: number | undefined;
    if ('unionidQq' in body) {
      userid = await this.getUseridByUnionidQq(body.unionidQq);
    } else if ('name' in body) {
      userid = await this.getUseridByPswd(body.name, body.pswd);
    }
    return userid ? sign(userid) : undefined;
  }

  /**
   * 获取用户信息，id > name > token
   * @param id 用户ID
   * @param name 用户名
   * @param token 用户token
   * @returns 用户信息
   */
  @Post('get_user')
  getUser(
    @Userid() userid: number,
    @Body() body: { id: number } | { name: string },
  ) {
    console.log('🐔 get_user: ', userid, body);

    let user;
    if ('id' in body) {
      user = this.prisma.user.findUnique({ where: { userid } });
    } else if ('name' in body) {
      user = this.prisma.user.findUnique({ where: { name: body.name } });
    } else if (userid) {
      user = this.prisma.user.findUnique({ where: { userid } });
    }

    const userInit: UserVO = {
      id: 0,
      name: '',
      img: '',
      info: {},
      setting: {
        page: {
          theme: 'light',
        },
        mylog: {
          tags: [],
          filters: [],
          filterIndex: 0,
          calendarTags: [],
        },
        map: {
          diyPoints: [],
        },
      },
      createtime: dayjs().valueOf(),
    } as const;

    // 覆盖算法有待优化
    const setting = {
      page: { ...userInit.setting.page, ...user.setting.page },
      mylog: { ...userInit.setting.mylog, ...user.setting.mylog },
      map: { ...userInit.setting.map, ...user.setting.map },
    };

    return { ...userInit, ...user, setting: setting };
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
    await this.prisma.user.update({ where: { userid }, data: body });
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
    await this.prisma.userlogin.update({
      where: { id: userid },
      data: {
        unionid_qq: body.unionidQq,
        unionid_weixin: body.unionidWeixin,
      },
    });
  }

  /**
   * 获取用户id
   * @param body 用户名&密码
   * @returns 用户id
   */
  async getUseridByPswd(name: string, pswd: string) {
    const user = (
      await this.prisma.$queryRawTyped(getUseridByPswd(name, pswd))
    )[0];
    return user ? Number(user.id) : undefined;
  }

  /**
   * 获取用户id
   * @param unionidQq QQ的unionid
   * @returns 用户id
   */
  async getUseridByUnionidQq(unionidQq: string) {
    return (
      await this.prisma.userlogin.findUnique({
        select: { id: true },
        where: { unionid_qq: unionidQq },
      })
    )?.id;
  }
}
