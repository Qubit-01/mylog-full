import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { PrismaClient } from '@prisma/client';

@Module({
  controllers: [LogController],
  providers: [LogService, PrismaClient],
})
export class LogModule {}
