<script lang="ts" setup>
import { ref, onMounted } from 'vue'

const { defaultLegacy } = defineProps<{
  /** 宽高比例，支持格式：[16,9] 或 1.777 */
  ratio: [number, number] | number
  /** 是否初始采用传统方案 */
  defaultLegacy?: boolean
}>()

// 不支持 aspect-ratio ?
const legacy = ref(defaultLegacy)

onMounted(() => {
  legacy.value = !CSS.supports('aspect-ratio', '1/1')
})
</script>

<template>
  <!-- 现代浏览器方案 -->
  <div class="AspectDiv" :class="{ legacy }">
    <slot v-if="!legacy" />
    <div v-else class="inner">
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.AspectDiv {
  // 现代浏览器方案，一直加着吧
  aspect-ratio: v-bind(
    'Array.isArray(ratio) ? `${ratio[0]} / ${ratio[1]}` : ratio'
  );

  /* 传统方案专用样式 */
  &.legacy {
    position: relative;

    &::before {
      content: '';
      display: block;
      padding-top: v-bind(
        'Array.isArray(ratio) ? `${(ratio[1] / ratio[0]) * 100}%`: `${ratio * 100}%`'
      );
    }

    > .inner {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  }
}
</style>

<!-- 
# AspectDiv 等比宽高Div

传入比例，元素的高度通过宽度自动等比缩放

## 缺陷

- 当浏览器不支持 aspect-ratio CSS属性时，元素是非 static 元素，用户需要注意内部元素的浮动定位

## 探索

- 方案一：使用 aspect-ratio CSS属性，可以设置div元素等比例缩放  
    Chrome 87 后支持，截止25年4月18日，87前的用户占比约为 7%，因此不能采用这个方案

- 方案二：CSS中，padding值使用百分比的话，相对的是父元素的宽度，通过这个撑开元素的高度  
    弊端是会多一层dom结构，并且元素是非 static 的

组件中会判断浏览器支持情况，优先使用 aspect-ratio 方案
-->
