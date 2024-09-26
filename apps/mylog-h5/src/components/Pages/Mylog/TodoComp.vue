<script setup lang="ts">
import useLogStore from '@/stores/log'

const Todos = useLogStore().todos
Todos.getLogs()
</script>

<template>
  <div class="todo-comp">
    <LogRelease isTodo />

    <LogTodo v-for="todo of Todos.listAll" :key="todo.id" :log="todo" />

    <div
      v-m
      v-if="!Todos.listAll.length && !Todos.loading"
      style="padding: var(--padding); border-radius: var(--border-radius)"
    >
      没有数据哦~
    </div>

    <LogLoading v-if="Todos.loading" />
  </div>
</template>

<style scoped lang="less">
.todo-comp {
  display: flex;
  flex-direction: column;
  gap: var(--gap);
}
</style>
