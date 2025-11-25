import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { LogModule } from './log/log.module';
import { TestController } from './test/test.controller';
import { CosController } from './cos/cos.controller';

@Module({
  imports: [UserModule, LogModule],
  controllers: [AppController, TestController, CosController],
  providers: [AppService],
})
export class AppModule { }
