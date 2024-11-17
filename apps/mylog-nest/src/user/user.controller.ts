import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { getUseridByPswd } from '@prisma/client/sql';
import { PrismaClient } from '@prisma/client';
import { sign } from 'src/utils/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly prisma: PrismaClient,
  ) {}

  /**
   * 获取token。用于登录，getUser不行，目前token只包含id信息
   * @param body unionidQq 或 name+pswd
   * @returns 用户token
   */
  @Get('token')
  async getToken(
    @Body() body: { unionidQq: string } | { name: string; pswd: string },
  ) {
    const userid = await this.getUserid(body);
    return userid ? sign(userid) : undefined;
  }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // @Get()
  // findAll() {
  //   return this.userService.findAll();
  // }

  @Get()
  findOne(id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
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
