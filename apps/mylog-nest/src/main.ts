import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import * as fs from 'fs';

const isDev = process.env.NODE_ENV !== 'production'

async function bootstrap() {
  const httpsOptions = isDev
    ? undefined
    : {
      key: fs.readFileSync('../../cert/mylog.ink.key'),
      cert: fs.readFileSync('../../cert/mylog.ink.crt'),
    };
  const app = await NestFactory.create(AppModule, {
    httpsOptions,
    cors: {
      origin: [
        'https://mylog.ink',
        'https://www.mylog.ink',
        'http://localhost:3000',
        'http://localhost',
      ],
      credentials: true,
    },
  });
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.listen(process.env.PORT ?? 20914);
}
bootstrap();
