<!-- 
  props 优先级比 log 高
  如果传入了props，那么就用props，否则用log
  传入的imgs一个数组对象，所有不能对log.imgs的地址进行修改

  腾讯云推荐的播放器：https://cloud.tencent.com/act/pro/cos-video?player=tcplayer&mode=mp4
  详细API文档：https://cloud.tencent.com/document/product/436/104530
  视频截帧：// todo
  https://cloud.tencent.com/document/product/436/101440
  https://cloud.tencent.com/document/product/460/47505
  
 -->
<script lang="ts" setup>
import { VideoPlay } from '@element-plus/icons-vue'
import Popup from '~/components/utils/Popup.vue'
import VideoDplayer from '~/components/viewer/VideoDplayer.vue'
// import DPlayer from 'dplayer'

/** files是视频列表，不传就用父组件注入的log.videos */
const props = defineProps<{ videos?: string[] }>()
// 从父组件拿到log，主要是获取userId
const log: Log = inject('log')!
// props.videos > log.videos
const videos = computed(() => props.videos ?? log.videos)
// 传入的地址转为正常的url
const urls = ref<string[]>(toFileUrl(videos.value, 'videos/', log.userid))
watch(videos, () => {
  urls.value = toFileUrl(videos.value, 'videos/', log.userid)
})

/** 当前播放的是视频地址，控制播放器的显示与否 */
const curUrl = ref('')
</script>

<template>
  <div class="viewer-videos">
    <div
      v-for="url in urls"
      :key="url"
      class="video"
      @click.stop="curUrl = url"
    >
      <img :src="`${url}?ci-process=snapshot&time=1&format=jpg`" alt="" />
      <!-- <video>
        <source :src="url" />
      </video> -->
      <VideoPlay class="video-icon" />
    </div>

    <!-- <div
      v-for="url in urls"
      :key="url"
      class="video"
      @click.stop="videoSrc = url"
    >
      <img
        :src="url + '?ci-process=snapshot&time=1&format=jpg'"
        alt="视频封面"
      />
    </div> -->
  </div>

  <!-- 真正用来播放的 -->
  <Popup v-if="curUrl" @close="curUrl = ''">
    <VideoDplayer :url="curUrl" class="video-play" autoplay />
  </Popup>
</template>

<style lang="scss" scoped>
.viewer-videos {
  white-space: nowrap;
  overflow-y: hidden;
  width: fit-content;
  max-width: 100%;

  display: flex;
  gap: var(--block-gap);

  .video {
    position: relative;
    width: var(--block-height);
    height: var(--block-height);

    border-radius: var(--block-border-radius);
    overflow: hidden;
    flex-shrink: 0;

    video,
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    // img {
    //   object-fit: cover;
    //   height: var(--block-height);
    //   width: var(--block-height);
    //   border-radius: var(--block-border-radius);
    // }

    // 图标
    .video-icon {
      position: absolute;
      color: white;
      opacity: 0.5;
      width: 50px;
      height: 50px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      &:hover {
        opacity: 1;
      }
    }
  }
}

.video-play {
  max-height: 90vh;
  max-width: 90vw;
}
</style>
