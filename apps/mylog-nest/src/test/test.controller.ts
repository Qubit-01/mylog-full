import { Body, Controller, Get, Post } from '@nestjs/common';
import { Cookies } from 'src/utils';

@Controller('test')
export class TestController {
  /**
   * 测试后端服务是否正常
   * @returns "Hello World!"
   */
  @Get('hello')
  hello(@Cookies() cookies: string, @Body() body: any) {
    console.log('🐤 Hello World! get');
    console.log('🐤 Cookies', cookies);
    console.log('🐤 Body', body);
    return '🐤 Hello World!';
  }

  /**
   * 测试后端服务是否正常
   * @returns "Hello World!"
   */
  @Post('hello_post')
  helloPost(@Cookies() cookies: string, @Body() body: any) {
    console.log('🐤 Hello World! post');
    console.log('🐤 Cookies', cookies);
    console.log('🐤 Body', body);
    return '🐤 Hello World!';
  }
}
