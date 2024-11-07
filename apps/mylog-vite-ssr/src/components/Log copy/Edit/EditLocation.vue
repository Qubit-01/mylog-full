<script setup lang="ts">
import { vOverflowEllipsis } from '@/utils/directives'
import AMap, { useAMap, l2v, getAddress } from '@/utils/map'

// 坐标
const location = defineModel<[[number, number], string] | []>({
  required: true,
})

const mapDom = ref<HTMLDivElement>()
const search = ref<string>('')

// 主要location标记
const marker = new AMap.Marker({
  title: '记录位置',
  // content: '📍',
})

const aMap = reactive(
  useAMap(mapDom, location.value[0] ? { center: location.value[0] } : {})
)

aMap.init.then(async map => {
  // 如果没有坐标，就使用定位
  if (!location.value[0]) location.value = [l2v(map.getCenter()), '']
  marker.setPosition(location.value[0]!)
  map.add(marker)

  // 点击地图时，设置坐标
  map.on('click', (ev: any) => {
    location.value = [l2v(ev.lnglat), '']
  })

  // 当坐标变化时，保持同步
  watch(
    () => location.value[0],
    () => {
      map.panTo(location.value[0]!, 1000)
      marker.setPosition(location.value[0]!)
      // 解析坐标
      getAddress(location.value[0]!).then((regeocode: any) => {
        location.value[1] = regeocode.formattedAddress
      })
    }
  )
})
</script>

<template>
  <div
    class="edit-location"
    v-loading="
      aMap.loading && {
        text: aMap.state,
      }
    "
  >
    <div class="map" ref="mapDom"></div>
    <div class="search-input">
      <ElInput v-model="search" placeholder="搜索地址" clearable />
    </div>
    <div class="formatted-address" v-overflow-ellipsis>{{ location[1] }}</div>
  </div>
</template>

<style scoped lang="less">
.edit-location {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  height: 200px;

  .map {
    height: 100%;
    // width: 100%;
  }

  .search-input {
    position: absolute;
    top: 0;
    margin: 4px;
  }

  .formatted-address {
    position: absolute;
    bottom: 0;
    margin: 4px;
    max-width: 100%;
  }
}
</style>
