<script lang="ts" setup>
import { vEllipsis } from '@mylog-full/mix/utils'

/** 坐标 */
const location = defineModel<LngLatVO | []>({ required: true })

const { user } = refsGlobalStore()
const $map = useTemplateRef('$map')

/** 主方法 */
const { state, init, geolocation } = useAMap(
  $map,
  { ...(location.value[0] ? { center: location.value[0] } : {}) },
  { theme: computed(() => user.value.setting.page.theme) },
)

// 主要location标记
const marker = new AMap.Marker({ title: '记录位置' })

init.then(async (map) => {
  map.on('click', (ev) => (location.value = [l2v(ev.lnglat), ''])) // 点击地图时，设置坐标
  map.add(marker)

  // 当坐标变化时，保持同步
  watch(
    () => location.value[0],
    (p) => {
      if (!p) return
      map.panTo(p, 500)
      marker.setPosition(p)
      // 解析坐标
      getAddress(p).then((regeocode) => {
        location.value[1] = regeocode.formattedAddress
      })
    },
    { immediate: true },
  )

  // 定位当前，如果有坐标就只打点，不移动，如果没坐标就改marker
  getPositionByGeo(geolocation).then((p) => {
    map.add(marker) // 使marker显示在最上层
    // 如果没有坐标，就使用定位
    !location.value[0] && (location.value = [l2v(p.position), ''])

    // 点击当前定位时，设置坐标
    geolocation._marker?.on('click', (ev) => {
      location.value = [l2v(ev.target.getPosition()), '']
    })
  })
})
</script>

<template>
  <div
    class="EditLocation"
    v-loading="state.loading && { text: state.message }"
  >
    <div class="map" ref="$map" />
    <div class="formatted-address" v-ellipsis>{{ location[1] }}</div>
  </div>
</template>

<style lang="scss" scoped>
.EditLocation {
  position: relative;
  border-radius: 8px;
  overflow: hidden;

  .map {
    height: 200px;
  }

  .formatted-address {
    position: absolute;
    bottom: 0;
    margin: 4px;
    // 减去定位按钮的宽度
    max-width: calc(100% - 32px - 15px);
    pointer-events: none;
  }
}
</style>
