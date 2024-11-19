import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as fs from 'fs';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    httpsOptions: {
      key: fs.readFileSync('./cert/mylog.cool.key'),
      cert: fs.readFileSync('./cert/mylog.cool.crt'),
    },
    cors: { origin: ['https://mylog.cool', 'https://www.mylog.cool'] },
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
