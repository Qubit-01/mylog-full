<script setup lang="ts">
import type { User } from '@/types'
import { getUser } from '@/api/user'
import { BucketCDN } from '@/stores/constant'
import useUserStore, { logout } from '@/stores/user'
import { ArrowDownBold, ArrowUpBold } from '@element-plus/icons-vue'
import { getCityByIp, getCityInfoByGeo } from '@/utils/map'
import { vImgSrc } from '@/utils/directives'

const user = ref<User>()

const router = useRouter()
const route = useRoute()

// 有id说明是带id查询（访客页面），没id就是自己（有设置）
const props = defineProps<{ id?: string }>()
watch(
  () => props.id,
  () => {
    if (props.id)
      getUser({ id: props.id }).then(resUser => (user.value = resUser))
    else user.value = useUserStore()
  },
  { immediate: true }
)

// 展开和收起
const isExpand = ref(false)

const tab = computed<string>({
  get: () => route.name as string,
  set: v => router.replace({ name: v }),
})

const location = ref<string>('')
getCityInfoByGeo()
  .then(res => {
    console.log('🐤', res)
    // location.value = res.city
  })
  .catch(e => {
    console.log(e)
  })

getCityByIp()
  .then(res => {
    console.log('🐤1', res)
    location.value = res.city
  })
  .catch(e => {
    console.log(e)
  })
</script>

<template>
  <div class="logger-page">
    <div v-if="user" class="logger-model" v-m>
      <div class="carousel">
        <img :src="BucketCDN + 'web-files/carousel-0.jpg'" />
        <div class="logout" @click="logout()">退出登录</div>
        <div v-if="location" class="location">
          <ElIcon><Location /></ElIcon>{{ location }}
        </div>
      </div>
      <div class="logger-info">
        <div class="img">
          <img
            v-img-src="
              user.img ||
              'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
            "
          />
        </div>
        <div class="text">
          <div class="name">
            {{ user.name }}
            <span class="info">
              <span>{{ user.id }}</span>
              <span>{{ user.info.sex }}</span>
              <span>{{ user.info.birth }}</span>
            </span>
          </div>
          <div class="info">
            <div>{{ user.info.text }}</div>
          </div>
          <div v-if="isExpand" class="more">
            <div>info: {{ user.info }}</div>
            <div>setting.mylog: {{ user.setting.mylog }}</div>
            <div>setting.page: {{ user.setting.page }}</div>
            <div>setting: {{ Object.keys(user.setting) }}</div>
          </div>
        </div>
        <ElButton
          class="down-bold"
          @click="isExpand = !isExpand"
          :icon="isExpand ? ArrowUpBold : ArrowDownBold"
          text
          circle
        />
      </div>
    </div>

    <ElRadioGroup v-if="!id" v-model="tab" size="large">
      <!-- size="large" -->
      <ElRadioButton label="多元记" value="logger" />
      <ElRadioButton label="设置" value="setting" />
    </ElRadioGroup>

    <RouterView />
  </div>
</template>

<style scoped lang="less">
.logger-page {
  display: flex;
  flex-direction: column;
  gap: var(--gap);

  .logger-model {
    overflow: hidden;
    border-radius: var(--border-radius);

    // 背景图片
    .carousel {
      height: 270px;
      position: relative;
      img {
        height: 100%;
        width: 100%;
        object-fit: cover;
      }
      .logout {
        position: absolute;
        top: 12px;
        right: 12px;

        border-radius: var(--border-radius);
        padding: 8px 12px;
        background-color: var(--m-background-color);
        backdrop-filter: blur(16px);

        cursor: pointer;
      }

      .location {
        position: absolute;
        bottom: 12px;
        left: 12px;

        display: flex;
        align-items: center;

        border-radius: var(--border-radius);
        padding: 6px 10px;
        background-color: var(--m-background-color);
        backdrop-filter: blur(8px);
      }
    }

    // 头像信息
    .logger-info {
      position: relative;
      padding: 16px 24px 24px 24px;

      // 用户信息
      .text {
        display: flex;
        flex-direction: column;
        gap: var(--gap);

        .name {
          // display: flex;
          // gap: var(--gap);
          font-size: 2rem;
          font-weight: bold;
          .info {
            display: inline-flex;
            gap: 0.5rem;
            font-size: 1rem;
            color: var(--color-2);
          }
        }
      }

      .down-bold {
        position: absolute;
        right: 16px;
        bottom: 16px;
      }

      // 头像
      .img {
        height: 150px;
        width: 150px;
        overflow: hidden;
        border: 2px solid #fff5;
        border-radius: 50%;

        position: absolute;
        top: -100px;
        right: 50px;
        img {
          height: 100%;
          width: 100%;
          object-fit: cover;
        }
      }
    }
  }
}
</style>
