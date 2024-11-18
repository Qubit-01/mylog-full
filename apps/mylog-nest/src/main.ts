import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('./cert/mylog.cool.key'),
      cert: fs.readFileSync('./cert/mylog.cool.crt'),
    },
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
