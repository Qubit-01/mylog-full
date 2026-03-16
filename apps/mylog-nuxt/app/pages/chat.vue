<script lang="ts" setup>
// definePageMeta({ middleware: 'auth' })
useHead({ title: 'AI 聊天室' })

// ---- 类型 ----
interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

// ---- 工具：渲染消息内容（换行 + 代码块） ----
const formatContent = (content: string): string => {
  // 代码块
  content = content.replace(
    /```(\w*)\n?([\s\S]*?)```/g,
    '<pre><code class="lang-$1">$2</code></pre>',
  )
  // 行内代码
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
  // 换行
  content = content.replace(/\n/g, '<br>')
  return content
}

const messages = ref<Message[]>([])
const input = ref('')
const loading = ref(false)

// 滚动容器
const scrollRef = ref<HTMLElement>()

const scrollToBottom = () => {
  nextTick(() => {
    if (scrollRef.value) {
      scrollRef.value.scrollTop = scrollRef.value.scrollHeight
    }
  })
}

// ---- 发送 ----
const send = async () => {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  scrollToBottom()

  loading.value = true
  try {
    const res = await $fetchApi<{ choices: { message: Message }[] }>(
      '/agent/chat',
      {
        body: {
          model: 'deepseek-chat',
          messages: messages.value,
        },
      },
    )
    const reply = res?.choices?.[0]?.message
    if (reply) {
      messages.value.push(reply)
      scrollToBottom()
    }
  } catch (error) {
    ElMessage.error(
      error instanceof Error ? error.message : '请求失败，请稍后重试',
    )
  } finally {
    loading.value = false
  }
}

// 回车发送，Shift+Enter 换行
const onKeydown = (e: KeyboardEvent | Event) => {
  if (e instanceof KeyboardEvent && e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault()
    send()
  }
}
</script>

<template>
  <div class="ChatPage">
    <!-- 头部 -->
    <div class="chat-header _m">
      <div class="title">
        <span class="icon">✨</span>
        <span>AI 聊天室</span>
        <span class="model">Deepseek</span>
      </div>
      <ElButton
        text
        size="small"
        @click="messages = []"
        :disabled="!messages.length"
      >
        清空对话
      </ElButton>
    </div>

    <!-- 消息区 -->
    <div class="chat-body _m" ref="scrollRef">
      <!-- 空状态 -->
      <div v-if="!messages.length" class="empty">
        <div class="empty-icon">🤖</div>
        <div>有什么我可以帮你的？</div>
      </div>

      <!-- 消息列表 -->
      <template v-for="(msg, i) in messages" :key="i">
        <div class="msg" :class="msg.role">
          <div class="bubble">
            <div class="content" v-html="formatContent(msg.content)" />
          </div>
        </div>
      </template>

      <!-- 加载中 -->
      <div v-if="loading" class="msg assistant">
        <div class="bubble loading"><span /><span /><span /></div>
      </div>
    </div>

    <!-- 输入区 -->
    <div class="chat-footer _m">
      <ElInput
        v-model="input"
        type="textarea"
        :autosize="{ minRows: 1, maxRows: 6 }"
        placeholder="输入消息，Enter 发送，Shift+Enter 换行"
        resize="none"
        @keydown="onKeydown"
      />
      <ElButton
        type="primary"
        :loading="loading"
        :disabled="!input.trim()"
        @click="send"
      >
        发送
      </ElButton>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.ChatPage {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  height: calc(100vh - var(--header-height, 50px) - var(--gap) * 4);
  min-height: 400px;

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px var(--padding);
    border-radius: var(--border-radius);
    flex-shrink: 0;

    .title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 1rem;
      font-weight: bold;

      .icon {
        font-size: 1.2rem;
      }

      .model {
        font-size: 0.75rem;
        font-weight: 400;
        opacity: 0.5;
        padding: 2px 6px;
        border: 1px solid currentColor;
        border-radius: 99px;
      }
    }
  }

  .chat-body {
    flex: 1;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: var(--padding);
    border-radius: var(--border-radius);

    .empty {
      margin: auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      opacity: 0.4;

      .empty-icon {
        font-size: 3rem;
      }
    }

    .msg {
      display: flex;
      max-width: 80%;

      &.user {
        align-self: flex-end;

        .bubble {
          background: var(--el-color-primary);
          color: #fff;
          border-radius: 16px 16px 4px 16px;
        }
      }

      &.assistant {
        align-self: flex-start;

        .bubble {
          background: var(--el-fill-color);
          border-radius: 16px 16px 16px 4px;
        }
      }

      .bubble {
        padding: 10px 14px;
        line-height: 1.6;
        word-break: break-word;
        font-size: 0.95rem;

        .content {
          :deep(pre) {
            background: #1e1e2e;
            color: #cdd6f4;
            padding: 12px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 8px 0;
            font-size: 0.85rem;
          }

          :deep(code) {
            font-family: 'Fira Code', monospace;
            background: #0002;
            padding: 1px 5px;
            border-radius: 4px;
            font-size: 0.88em;
          }

          :deep(pre code) {
            background: transparent;
            padding: 0;
          }
        }

        // 加载动画
        &.loading {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 12px 16px;

          span {
            width: 7px;
            height: 7px;
            border-radius: 50%;
            background: var(--el-color-primary);
            animation: bounce 1.2s infinite ease-in-out;

            &:nth-child(2) {
              animation-delay: 0.2s;
            }
            &:nth-child(3) {
              animation-delay: 0.4s;
            }
          }
        }
      }
    }
  }

  .chat-footer {
    display: flex;
    gap: 8px;
    align-items: flex-end;
    padding: 12px var(--padding);
    border-radius: var(--border-radius);
    flex-shrink: 0;

    .el-textarea {
      flex: 1;
    }

    .el-button {
      flex-shrink: 0;
      height: 32px;
    }
  }
}

@keyframes bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
