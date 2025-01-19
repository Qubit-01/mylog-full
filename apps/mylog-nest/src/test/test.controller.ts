import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  /**
   * 测试后端服务是否正常
   * @returns "Hello World!"
   */
  @Get('hello')
  hello() {
    console.log('Hello World!');
    return 'Hello World!';
  }
}
