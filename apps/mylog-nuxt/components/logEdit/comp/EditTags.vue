<!-- 
  EditTags
  封装的编辑tags控件，默认可删除，可添加，无重复
  默认传入的列表是不重复的
-->
<script lang="ts" setup>
const tags = defineModel<string[]>({ required: true })
const { size, repeatable, selectList } = defineProps<{
  /** 组件的尺寸 */
  size?: 'large' | ''
  /** 数组可不可以重复，不传就是不能重复 */
  repeatable?: boolean
  /** 是否要待选列表 */
  selectList?: boolean
}>()
const emits = defineEmits<{
  /** 点击Tag触发的事件 */
  (e: 'clickTag', value: string): void
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

// const Setting = useUserStore().setting
// const addSelect = (tag: string) => {
//   if (repeatable || !tags.value.includes(tag)) {
//     tags.value.push(tag)
//   }
// }
</script>

<template>
  <div class="EditTags">
    <div class="main">
      <slot />
      <ElTag
        v-for="tag in tags"
        :key="tag"
        class="tag"
        closable
        @close="del(tag)"
        @click="emits('clickTag', tag)"
        :size
      >
        {{ tag }}
      </ElTag>
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
        + 标签
      </ElButton>

      <slot name="tail" />
    </div>

    <!-- <div v-if="selectList" class="select">
      <ElTag
        v-for="tag in Setting.mylog.tags"
        :key="tag"
        class="tag"
        @click="addSelect(tag)"
        :size
        :type="tags.includes(tag) ? 'primary' : 'info'"
      >
        {{ tag }}
      </ElTag>
    </div> -->
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

  // .select {
  //   display: flex;
  //   gap: v-bind("size==='large'?'8px':'4px'");
  //   flex-wrap: wrap;

  //   .tag {
  //     cursor: pointer;
  //   }
  // }
}
</style>
