<!-- 
  props 优先级比 log 高
  如果传入了props，那么就用props，否则用log
  传入的imgs一个数组对象，所有不能对log.imgs的地址进行修改

  腾讯云推荐的播放器：https://cloud.tencent.com/act/pro/cos-video?player=tcplayer&mode=mp4
  详细API文档：https://cloud.tencent.com/document/product/436/104530
  
 -->
<script lang="ts" setup>
import { toFileUrl } from '@mylog-full/mix/utils'
// import VideoDplayer from '~/components/utils/viewer/VideoDplayer.vue'
// import DPlayer from 'dplayer'

// 从父组件拿到log，主要是获取userId
const log: Log = inject('log')!

/** files是视频列表，不传就用父组件注入的log.videos */
const props = defineProps<{ videos?: string[] }>()
/** 视频名称列表，计算从哪里取属性 */
const videos = computed(() => props.videos || log.videos)

/**
 * 真正的视频URL列表
 * 传入的文件要处理，如果不是http开头，那么就加上OOS地址，否则直接用，而且要改为https
 */
const videoUrls = computed(() => toFileUrl(videos.value, 'videos/', log.userid))

/** 当前播放的是视频地址，控制播放器的显示与否 */
const videoSrc = ref('')
</script>

<template>
  <div class="viewer-videos">
    <div
      v-for="video in videoUrls"
      :key="video"
      class="video"
      @click.stop="videoSrc = video"
    >
      <video>
        <source :src="video" />
      </video>
      <VideoPlay class="video-icon" />
    </div>
  </div>

  <!-- 真正用来播放的 -->
  <!--
      autoplay 自动开始播放 controls 显示播放器控件
      poster 视频封面 loop 循环播放
      muted 默认静音 preload 页面加载时加载，并预备播放
      none:播放前不会预先下载视频资源，用户不点击播放时会省宽带；
      metadata:播放前不会下载视频资源，但是会获取资源的元数据；
      auto:根据实际情况动态决定
    -->
  <TeleportBody v-if="videoSrc" @close="videoSrc = ''">
    <VideoDplayer :videoSrc class="video-play" autoplay />
  </TeleportBody>
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
    height: var(--block-height);

    video {
      object-fit: cover;
      height: var(--block-height);
      width: var(--block-height);
      border-radius: var(--block-border-radius);
    }

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
    }

    &:hover .video-icon {
      opacity: 1;
    }
  }
}

.video-play {
  max-height: 90vh;
  max-width: 90vw;
}
</style>
