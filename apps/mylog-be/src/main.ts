import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

const origin = [
  'https://mylog.ink',
  'https://www.mylog.ink',
  'http://mylog.ink',
  'http://www.mylog.ink',
  'http://localhost',
]

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin, credentials: true },
  });
  app.use(cookieParser()); // 解析cookie
  app.useGlobalPipes(new ValidationPipe({ transform: true })); // 全局验证器，自动转换参数类型，错误直接400
  await app.listen(process.env.PORT ?? 20914);
}
bootstrap();
