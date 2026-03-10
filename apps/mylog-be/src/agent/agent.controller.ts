import { Body, Controller, Post } from '@nestjs/common';
import OpenAI from 'openai';
import { type ChatCompletionCreateParamsNonStreaming } from 'openai/resources/index.js';
import { Cookies } from 'src/utils';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DeepseekApiKey,
});

@Controller('agent')
export class AgentController {
  /** AI 聊天：对应 openai.chat.completions */
  @Post('chat')
  async helloPost(@Cookies() cookies: string, @Body() body: ChatCompletionCreateParamsNonStreaming) {
    console.log('🐔 chat: ', body.messages.at(-1));
    return await openai.chat.completions.create(body);
  }
}
