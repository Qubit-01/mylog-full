<script lang="ts" setup>
import { vEllipsis, vImgSrc } from '@mylog-full/mix/utils'
import AspectDiv from '~/components/utils/AspectDiv.vue'
import { Location, Male, Female } from '@element-plus/icons-vue'

definePageMeta({ middleware: 'auth' })
useHead({ title: '用户' })
const { user } = refsGlobalStore()

const imgFallback =
  'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

// watchEffect(() => {
//   console.log('LSQ> user', user.value)
// })

const location = ref<string>('')
onMounted(() => {
  getCityByIp()
    .then((res) => {
      location.value = res.city
    })
    .catch((e) => {
      console.log(e)
    })
})
</script>

<template>
  <div class="LoggerPage">
    <div class="top _m">
      <AspectDiv class="background" :ratio="2">
        <img :src="BucketCDN + 'web-files/img/carousel-1.jpg'" alt="" />
      </AspectDiv>
      <div class="info">
        <img class="avatar" v-img-src="user.img ?? imgFallback" alt="" />
        <div v-if="location" class="location">
          <ElIcon><Location /></ElIcon>{{ location }}
        </div>

        <div class="info-1">
          <div class="name" v-ellipsis>{{ user.name }}</div>
          <div class="info-1-1">
            <span class="sex-age">
              <ElIcon v-if="user.info.sex" class="sex" size="16" color="blue">
                <Male v-if="user.info.sex === '男'" />
                <Female v-if="user.info.sex === '女'" />
              </ElIcon>
              <span>
                {{
                  dayjs().diff(dayjs(user.info.birth, 'YYYY-MM-DD'), 'year')
                }}岁
              </span>
            </span>
            <span>ID: {{ user.id }}</span>
          </div>
        </div>

        <div class="detail">
          <div>{{ user.info.text }}</div>

          <!-- <div>info: {{ user.info }}</div>
          <div>setting.mylog: {{ user.setting.mylog }}</div>
          <div>setting.page: {{ user.setting.page }}</div>
          <div>setting: {{ Object.keys(user.setting) }}</div> -->
        </div>
        <!--
        <div class="location" v-if="user?.location">{{ user?.location }}</div>
        -->
      </div>
    </div>
    <div>
      <ElButton @click="signout()">退出登录</ElButton>
    </div>
    <div class="_m">
      {{ user }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.LoggerPage {
  .top {
    border-radius: var(--border-radius);

    .background {
      width: 100%;
      max-height: 250px;
      // height: 120px;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: var(--border-radius) var(--border-radius) 0 0;
      }
    }

    .info {
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 8px;

      height: 200px;

      .avatar {
        position: absolute;
        left: 16px;
        top: -40px;

        width: 112px;
        height: 112px;
        object-fit: cover;
        background-color: #999;
        border: 2px solid #9999;
        border-radius: 12px;
      }

      .location {
        position: absolute;
        right: 16px;
        top: -40px;

        display: flex;
        align-items: center;
        gap: 4px;
      }

      .info-1 {
        margin-left: 144px;

        .name {
          font-size: 2rem;
          font-weight: bold;
          line-height: 48px;
        }

        .info-1-1 {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;

          .sex-age {
            display: inline-flex;
            align-items: center;
            gap: 4px;
            height: 24px;
            border-radius: 99px;
            padding: 0 6px;
            background-color: #9999;
          }
        }
      }

      .detail {
        padding: var(--padding);
        // border: 2px solid red;
      }
    }
  }
}
</style>
