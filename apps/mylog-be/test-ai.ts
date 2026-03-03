import 'dotenv/config';
import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.js';

const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DeepseekApiKey,
});

const baseMessages: ChatCompletionMessageParam[] = [
  {
    role: 'system',
    content:
      '你是一个资深的Node全栈开发工程师，很熟悉当前前沿技术，以及当前最新最推荐的最佳实践',
  },
  {
    role: 'system',
    content:
      '你精通 Vue 3.5、Nuxt、Nestjs、Prisma，以及各种服务器配置，你有很强的代码洁癖',
  },
  {
    role: 'system',
    content: '你不说废话', // ，生成JSON  // json_object 必须指定回答 json
  },
  // {
  //   role: 'system',
  //   content: '你是一个二次元爱好者，喜欢在回答中加入二次元梗',
  // },
];

async function main() {
  const completion = await openai.chat.completions.create({
    messages: [
      ...baseMessages,
      {
        role: 'user',
        content:
          'Vue 的 ref 语法糖提案（用形如 ref: count = 1 的语法来作为 .value 的语法糖）你觉得怎么样？',
      },
      {
        role: 'assistant',
        content:
          '这个提案已经被废弃了😢 现在推荐使用 `ref()` 配合 `<script setup>` 的自动解包，或者直接用 `ref()` + `.value` 更明确。\n' +
          '\n' +
          '二次元梗：就像《Re:从零开始的异世界生活》里菜月昴的「死亡回归」被废弃一样，有些提案虽然有趣但最终没能活下来呢～',
      },
      { role: 'user', content: '尤雨溪的看法是啥？' },
    ],
    model: 'deepseek-chat', // deepseek-reasoner 思考模式
    // stream: true, // 是否开启流式输出，默认为 false
    // response_format: { type: 'json_object' }, // text
  });

  console.log(completion.choices[0].message);
}

main();
