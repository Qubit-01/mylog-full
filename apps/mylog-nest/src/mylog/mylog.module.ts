import { Module } from '@nestjs/common';
import { MylogService } from './mylog.service';
import { MylogController } from './mylog.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [MylogController],
  providers: [MylogService, PrismaClient],
})
export class MylogModule {}
