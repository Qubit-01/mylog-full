import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';
import { RelationModule } from './relation/relation.module';
import { TestController } from './test/test.controller';

@Module({
  imports: [UserModule, LogModule, RelationModule],
  controllers: [AppController, TestController],
  providers: [AppService],
})
export class AppModule {}
