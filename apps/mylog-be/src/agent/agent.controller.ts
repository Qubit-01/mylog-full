import { Body, Controller, Post } from '@nestjs/common';
import OpenAI from 'openai';
import { Cookies } from 'src/utils';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DeepseekApiKey,
});

@Controller('agent')
export class AgentController {
  /** AI 聊天：对应 openai.chat.completions */
  @Post('chat')
  async helloPost(@Cookies() cookies: string, @Body() body: any) {
    return await openai.chat.completions.create(body);
  }
}
