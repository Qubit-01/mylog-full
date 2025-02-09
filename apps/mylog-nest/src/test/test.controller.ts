import { Controller, Get } from '@nestjs/common';
import { Cookies } from 'src/utils';

@Controller('test')
export class TestController {
  /**
   * 测试后端服务是否正常
   * @returns "Hello World!"
   */
  @Get('hello')
  hello(@Cookies() cookies: string) {
    console.log('🐤 Hello World!');
    console.log('🐤 Cookies', cookies);
    return '🐤 Hello World!';
  }
}
