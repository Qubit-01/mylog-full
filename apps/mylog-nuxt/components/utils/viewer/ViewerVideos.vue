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
import COS, { toFileUrl } from '@mylog-full/mix/cos'
// import VideoDplayer from '~/components/utils/viewer/VideoDplayer.vue'
// import DPlayer from 'dplayer'

/** files是视频列表，不传就用父组件注入的log.videos */
const props = defineProps<{ videos?: string[] }>()
// 从父组件拿到log，主要是获取userId
const log: Log = inject('log')!
// props.videos > log.videos
const videos = computed(() => props.videos ?? log.videos)
// 传入的地址转为正常的url
const urls = ref<string[]>(
  toFileUrl(videos.value, 'compress-imgs/', log.userid),
)
watch(videos, () => {
  urls.value = toFileUrl(videos.value, 'compress-imgs/', log.userid)
})

/** 当前播放的是视频地址，控制播放器的显示与否 */
const videoSrc = ref('')
</script>

<template>
  <div class="viewer-videos">
    <div
      v-for="url in urls"
      :key="url"
      class="video"
      @click.stop="videoSrc = url"
    >
      <img
        :src="url + '?ci-process=snapshot&time=1&format=jpg'"
        alt="视频封面"
      />
    </div>
    <!-- 
      ?q-sign-algorithm=sha1
      &q-ak=AKID2N8QnaC0-BGh-zaZ2U5y5iw9pzHbP9tcdcRdZ2IVfcVbYxzvlCTcoEJsk7RZNqcK
      &q-sign-time=1739794856;1739798456
      &q-key-time=1739794856;1739798456
      &q-header-list=
      &q-url-param-list=
      &q-signature=8391ba3fcf83a4332d2d95ed9ab32b9e3a191acd
      &x-cos-security-token=Ej132PaZwGJ8S3HTkmyCeeHAoi9wfJza52d901436d71858e40c75d0e38f5af669SMNoe4TAb63napvhkJ81E-V2DY-W5g5oWgUjU5eMtXSe0IhddmhaOFdWzaikN58RFyU8s3GaRWVO71EXcIcBxC-sWjE0EltupB5BR79tTSg8tPwm_brEvNcm6y_clxUGdTuc3H40AgTpDP4s71FRZaXIYtbpyIzch-joJuJZhXqZ2eoV_9DXixvrdvo0K9bM4NrzE2BG2oUtawte7re0w
      &ci-process=snapshot
      &time=1
      &format=jpg 
    -->
    <!-- 
      ?q-sign-algorithm=sha1
      &q-ak=AKIDoLmnbG1G6SIeuRjpbSkvMhJoVIr7NVFZF7dJ6xh9RsbaSzocHO73hZMghYh-nbrs
      &q-sign-time=1739796027;1739799627
      &q-key-time=1739796027;1739799627
      &q-header-list=
      &q-url-param-list=
      &q-signature=5a4b3b46f3529f32d098f3d45f1462952ced7b0c
      &x-cos-security-token=Ej132PaZwGJ8S3HTkmyCeeHAoi9wfJza46e763194756f6295a1f090449c5a1c19SMNoe4TAb63napvhkJ81JBJA2-ow2I2Bs02QJ8WVprV7cmT_tfyVxdJSJrlytGoqYD6aryPGmqIM7e4R8gtjqaySUlg2Eet0Hnu4UTIQ41VcsSCZMLFS-MVcQgsB4qNVB6ampLZsnPYeCqIcRQnvO9oaAT2MYQL2ChqHyyWSPE-PsamM-Do6XCARDmOz1ez8Q1AI5fxR0InVvAp5-ikdg
      &ci-process=snapshot
      &time=1
      &format=jpg
    -->
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
  <!-- <TeleportBody v-if="videoSrc" @close="videoSrc = ''">
    <VideoDplayer :videoSrc class="video-play" autoplay />
  </TeleportBody> -->
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

    img {
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
