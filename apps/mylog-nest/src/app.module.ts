import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MylogModule } from './mylog/mylog.module';

@Module({
  imports: [UserModule, MylogModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
