import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { getUseridByPswd } from '@prisma/client/sql';
import { PrismaClient } from '@prisma/client';
import { sign, verify } from 'src/utils/jwt';

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
    const userid = await this.getUserid(body);
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
  getUser(@Body() body: { id: number } | { name: string } | { token: string }) {
    if ('id' in body) {
      return this.prisma.user.findUnique({
        where: { userid: Number(body.id) },
      });
    } else if ('name' in body) {
      return this.prisma.user.findUnique({ where: { name: body.name } });
    } else if ('token' in body) {
      return this.prisma.user.findUnique({
        where: { userid: verify(body.token) },
      });
    }
  }

  /**
   * 设置用户信息
   * @param token 用户令牌，
   * @param data 要设置的数据。目前只能设置img/info/setting
   */
  @Post('set_user')
  async setUser(
    @Body()
    body: {
      token: string;
      data: {
        img?: string;
        info?: string;
        setting?: string;
      };
    },
  ) {
    const userid = verify(body.token);
    await this.prisma.user.update({
      where: { userid },
      data: body.data,
    });
  }

  /**
   * 设置用户登录数据
   * @param token 用户令牌
   * @param unionidQq QQ的unionid
   * @param unionidWeixin 微信的unionid
   */
  @Post('set_userlogin')
  async setUserLogin(
    @Body() body: { token: string; unionidQq?: string; unionidWeixin?: string },
  ) {
    const userid = verify(body.token);
    await this.prisma.userlogin.update({
      where: { id: userid },
      data: {
        unionid_qq: body.unionidQq,
        unionid_weixin: body.unionidWeixin,
      },
    });
  }

  /**
   * 通过login表获取userid，这个先不暴露，需要复用的话再提取service
   * @param body unionidQq > name+pswd
   * @returns 用户id，没有返回undefined
   */
  async getUserid(
    body: { unionidQq: string } | { name: string; pswd: string },
  ) {
    if ('unionidQq' in body) {
      return (
        await this.prisma.userlogin.findUnique({
          select: { id: true },
          where: { unionid_qq: body.unionidQq },
        })
      )?.id;
    } else if ('name' in body) {
      const user = (
        await this.prisma.$queryRawTyped(getUseridByPswd(body.name, body.pswd))
      )[0];
      return user ? Number(user.id) : undefined;
    }
  }
}
