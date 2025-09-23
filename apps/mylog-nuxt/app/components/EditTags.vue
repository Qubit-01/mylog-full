<script lang="ts" setup>
const tags = defineModel<string[]>({ required: true })
const { label, size, repeatable, clickTag, noClose, noNew } = defineProps<{
  /** 组件前面的文字 */
  label?: string
  /** 组件的尺寸 */
  size?: 'large' | ''
  /** 数组可不可以重复，不传就是不能重复 */
  repeatable?: boolean
  /** 点击Tag触发的事件，不想写Emit了 */
  clickTag?: (tag: string) => void
  /** 是否可以删除 */
  noClose?: boolean
  /** 是否不可以加，没有删除按钮，没有添加按钮 */
  noNew?: boolean
}>()

const inputVisible = ref(false)
const inputValue = ref('')
const inputDom = ref<HTMLInputElement>()

// 点击删除按钮
const del = (tag: string) => {
  tags.value.splice(tags.value.indexOf(tag), 1)
}

// 单击添加标签
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputDom.value!.focus()
  })
}

// 输入框回车或者失去焦点
const inputConfirm = () => {
  inputVisible.value = false
  if (
    inputValue.value &&
    (repeatable || !tags.value.includes(inputValue.value))
  ) {
    tags.value.push(inputValue.value)
  }
  inputValue.value = ''
}
</script>

<template>
  <div class="EditTags">
    <div class="main">
      <template v-if="label">{{ label }}</template>
      <slot />
      <ElTag
        v-for="tag in tags"
        :key="tag"
        class="tag"
        :closable="!noClose"
        @close="del(tag)"
        @click="clickTag && clickTag(tag)"
        :size
      >
        {{ tag }}
      </ElTag>
      <template v-if="!noNew">
        <ElInput
          v-if="inputVisible"
          ref="inputDom"
          v-model="inputValue"
          maxlength="20"
          :size="size === 'large' ? '' : 'small'"
          @keyup.enter="inputConfirm"
          @blur="inputConfirm"
          style="width: 100px"
        />
        <ElButton
          v-else
          :size="size === 'large' ? '' : 'small'"
          @click="showInput"
          style="width: 100px"
        >
          + New Tag
        </ElButton>
      </template>

      <slot name="tail" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.EditTags {
  display: flex;
  flex-direction: column;
  gap: v-bind("size==='large'?'8px':'4px'");

  .main {
    display: flex;
    gap: v-bind("size==='large'?'8px':'4px'");
    flex-wrap: wrap;

    .tag {
      cursor: pointer;
    }
  }
}
</style>
