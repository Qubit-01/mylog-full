<script lang="ts" setup>
import { Clock, FolderOpened, Picture, PriceTag, User, VideoCamera } from '@element-plus/icons-vue';
import type { LogEdit, LogItem } from '@mylog-full/mix/types';

// const visible = defineModel<{ [key in LogItem]?: boolean }>({ required: true })

// const { setItem, closeItem } = defineProps<{
//   setItem: <T extends LogItem>(item: T, data?: LogEdit[T]) => void
//   closeItem: (item: LogItem) => void
// }>()

const map = {
  logtime: Clock,
  // tags: PriceTag,
  // imgs: Picture,
  // videos: VideoCamera,
  // // audios: Microphone,
  // files: FolderOpened,
  // location: Location,
  // people: User,
  // // info: More,
}


const visibleInit = () => ({
  logtime: false,
  tags: false,
  imgs: false,
  videos: false,
  audios: false,
  files: false,
  location: false,
  people: false,
  info: false,
})
const visible = reactive<{ [key in LogItem]?: boolean }>(visibleInit())
</script>

<template>
  <div class="control-icons">
    <ElButton link :icon="Clock" @click="" :type="'primary'" />
    <!-- <template v-for="(v, k) of map">
      <ElButton v-if="visible[k] !== undefined" link :icon="v" @click="visible[k] ? closeItem(k) : setItem(k)"
        :type="visible[k] ? 'primary' : undefined" />
    </template> -->
  </div>
</template>

<style lang="scss" scoped></style>
