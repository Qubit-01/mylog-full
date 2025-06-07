import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [
        'https://mylog.ink',
        'https://www.mylog.ink',
        'http://mylog.ink',
        'http://www.mylog.ink',
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
