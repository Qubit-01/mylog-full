<script lang="ts" setup>
// 坐标
const location = defineModel<[[number, number], string] | []>({
  required: true,
})
location.value = [[116.274236, 39.942423], '']
watchEffect(() => {
  console.log('LSQ> location', location.value)
})

const $map = useTemplateRef('$map')
useAMap($map, {
  center: location.value[0],
  mapStyle: true ? 'amap://styles/dark' : 'amap://styles/normal', // 设置地图的显示样式
})
</script>

<template>
  <div class="EditLocation">
    <div class="map" ref="$map" />
    <!-- <div class="search-input">
      <ElInput v-model="search" placeholder="搜索地址" clearable />
    </div>
    <div class="formatted-address" v-overflow-ellipsis>{{ location[1] }}</div> -->
  </div>
</template>

<style lang="scss" scoped>
.EditLocation {
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
