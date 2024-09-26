<script setup lang="ts">
import type { Log } from '@/types'
import { flatten } from 'lodash'
import useLogStore from '@/stores/log'
import AMap, {
  useAMap,
  createLayer,
  l2v,
  Markers,
  getPositionByGeo,
} from '@/utils/map'
import useUserStore from '@/stores/user'

const User = useUserStore()

const Mylog = useLogStore().mylog
const mapDom = ref<HTMLDivElement>()
// 当前显示的log
const log = reactive<{
  list: Log[]
  curIndex: number
}>({
  list: [],
  curIndex: 0,
})

/**
 * 分类的marker
 */
const markers = reactive<{
  act: AMap.Marker // 活动的临时坐标
  // log: AMap.Marker[] // log里面的
  diy: AMap.Marker[] // 用户临时添加的
}>({
  // act: new AMap.Marker(),
  act: Markers.point(),
  // log: [],
  diy: [],
})

// 图层
const layers = {
  default: createLayer('default'),
  tile: createLayer('tile'),
  satellite: createLayer('satellite'),
  traffic: createLayer('traffic'),
  roadNet: createLayer('roadNet'),
}

const aMap = reactive(
  useAMap(mapDom, {
    layers: [
      layers.default,
      layers.tile,
      layers.satellite,
      layers.traffic,
      layers.roadNet,
    ],
  })
)

aMap.init.then(async map => {
  // map.add(markers.cur)
  map.add(markers.act)

  // 点击地图时，设置坐标
  map.on('click', ev => {
    data.input = l2v(ev.lnglat)
    markers.act.setPosition(ev.lnglat)
  })

  if (!Mylog.listAll.length) await Mylog.getLogs()

  type Point = { weight: number; lnglat: AMap.Vector2; data: any }

  // Log点集，可以携带数据
  const logPoints: Point[] = Mylog.listFilter
    .filter(log => log.location.length)
    .map(l => ({ weight: 1, lnglat: l.location[0]!, data: l }))

  // Log点聚合
  new AMap.MarkerCluster(map, logPoints, {
    gridSize: 20,
    clusterByZoomChange: true,
    // 聚合点
    renderClusterMarker(context: {
      clusterData: any[]
      count: number
      marker: AMap.Marker
    }) {
      // context属性 marker:当前聚合点，count:当前聚合点内的点数量
      const c = context.count > 50 ? 50 : context.count > 30 ? 30 : 1
      const s = context.count > 50 ? 36 : context.count > 30 ? 30 : 24
      context.marker.setContent(
        `<div class="log-marker gt${c}" style="--size: ${s}px;">${context.count}</div>`
      )
      context.marker.setOffset(new AMap.Pixel(-s / 2, -s / 2))
      context.marker.on('click', e => {
        log.curIndex = 1
        log.list = flatten(
          context.clusterData.map(d => d._amapMarker.originData[0])
        )
          .map((d: any) => d.data)
          .sort((a: Log, b: Log) => b.logtime.diff(a.logtime))
      })
    },
    // 非聚合点 context.marker:当前非聚合点
    renderMarker(context: { data: any[]; count: number; marker: AMap.Marker }) {
      context.marker.setContent('<div class="log-marker"></div>')
      context.marker.setOffset(new AMap.Pixel(-9, -9))
      context.marker.on('click', () => {
        log.curIndex = 1
        log.list = context.data.map(d => d.data)
      })
    },
  })

  // 用户点集，可以携带数据
  const diyPoints: Point[] = User.setting.map.diyPoints.map(l => ({
    weight: 1,
    lnglat: l.lnglat,
    data: l,
  }))

  // Log点聚合
  new AMap.MarkerCluster(map, diyPoints, {
    gridSize: 20,
    clusterByZoomChange: true,
    // 聚合点
    renderClusterMarker(context: {
      clusterData: any[]
      count: number
      marker: AMap.Marker
    }) {
      // context属性 marker:当前聚合点，count:当前聚合点内的点数量
      const c = context.count > 50 ? 50 : context.count > 30 ? 30 : 1
      const s = context.count > 50 ? 36 : context.count > 30 ? 30 : 24
      context.marker.setContent(
        `<div class="log-marker gt${c}" style="--size: ${s}px;">${context.count}</div>`
      )
      context.marker.setOffset(new AMap.Pixel(-s / 2, -s / 2))
      // context.marker.on('click', e => {
      //   log.curIndex = 1
      //   log.list = flatten(
      //     context.clusterData.map(d => d._amapMarker.originData[0])
      //   )
      //     .map((d: any) => d.data)
      //     .sort((a: Log, b: Log) => b.logtime.diff(a.logtime))
      // })
    },
    // 非聚合点 context.marker:当前非聚合点
    renderMarker(context: { data: any[]; count: number; marker: AMap.Marker }) {
      context.marker.setContent('<div class="log-marker"></div>')
      context.marker.setOffset(new AMap.Pixel(-9, -9))
      // context.marker.on('click', () => {
      //   log.curIndex = 1
      //   log.list = context.data.map(d => d.data)
      // })
    },
  })
})

// 添加标记方法封装
const addMarker = (lnglat: [number, number]) => {
  const marker = new AMap.Marker({
    map: aMap.map,
    position: lnglat,
  })
  markers.diy.push(marker)
  return marker
}

// 设置图层显示隐藏
const data = reactive<{
  location: [number, number]
  input: [number, number]
  visible: {
    [key: string]: boolean
  }
}>({
  location: [0, 0],
  input: [116.397428, 39.90923],
  visible: {
    default: true,
    tile: false,
    satellite: false,
    traffic: false,
    roadNet: false,
  },
})

// 启用地图图层
const curLayers = ref<string[]>(['default'])
watch(curLayers, () => {
  for (const l in data.visible) data.visible[l] = curLayers.value.includes(l)
})

// 监听图层显示隐藏
for (const k in data.visible) // @ts-ignore
  watchEffect(() => layers[k][data.visible[k] ? 'show' : 'hide']())

/**
 * 定位到当前
 */
const getLocationLoading = ref(false)
const currentLocation = () => {
  getLocationLoading.value = true
  getPositionByGeo(aMap.locationController).then(() => {
    getLocationLoading.value = false
  })
}

/**
 * 移动到指定坐标
 */
const panTo = () => {
  markers.act.setPosition(data.input)
  aMap.map!.panTo(data.input)
}

// 打标
const setMarker = () => {
  addMarker(data.input)
}
</script>

<template>
  <!-- {{ User.setting.map }} -->
  <div class="map-page" v-m v-loading="aMap.loading && { text: aMap.state }">
    <div>
      <ElButton @click="currentLocation" :loading="getLocationLoading">
        定位
      </ElButton>
      {{ data.location }}
    </div>
    <div class="lnglat-input">
      <ElInput v-model="data.input[0]" placeholder="lng经度" />
      <ElInput v-model="data.input[1]" placeholder="lat纬度" />
      <ElButton @click="panTo" :disabled="!data.input[0] || !data.input[1]">
        转到
      </ElButton>
      <ElButton @click="setMarker">打标</ElButton>
    </div>
    <!-- <div class="diy-lnglat">
      <ElInput v-model="data.input[0]" placeholder="lng经度" />
      <ElInput v-model="data.input[1]" placeholder="lat纬度" />
      <ElButton @click="panTo" :disabled="!data.input[0] || !data.input[1]">
        转到
      </ElButton>
      <ElButton @click="setMarker">打标</ElButton>
    </div> -->

    <div class="control-layer">
      <ElCheckboxGroup v-model="curLayers">
        <ElCheckboxButton value="default" label="基础地图和文字" />
        <ElCheckboxButton value="tile" label="旅游地图" />
        <ElCheckboxButton value="satellite" label="卫星地图" />
        <ElCheckboxButton value="traffic" label="交通" />
        <ElCheckboxButton value="roadNet" label="路网" />
      </ElCheckboxGroup>
    </div>

    <div class="map" ref="mapDom"></div>

    <div v-if="log.list.length" class="logs">
      <Log
        :log="log.list[log.curIndex - 1]"
        :key="log.list[log.curIndex - 1].id"
      >
        <template #bottom>
          <ElPagination
            small
            background
            layout="prev, pager, next"
            :page-size="1"
            v-model:current-page="log.curIndex"
            :total="log.list.length"
            hide-on-single-page
            style="justify-content: center"
          />
        </template>
      </Log>
    </div>
  </div>
</template>

<style scoped lang="less">
.map-page {
  position: relative;
  border-radius: var(--border-radius);
  padding: var(--padding);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  gap: 8px;
  height: calc(100vh - var(--header-top) - var(--gap));

  .lnglat-input {
    display: flex;
    gap: 8px;
    > * {
      margin: 0;
    }
  }

  .control-layer {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
  .map {
    flex: 1;
    // height: calc(100vh - var(--header-top));
  }

  .logs {
    position: absolute;
    bottom: var(--padding);
    left: var(--padding);
    right: var(--padding);
    // width: 100%;
    // display: flex;
  }

  // Log Marker样式定义
  :deep(.log-marker) {
    --color: var(--el-color-primary-light-3);
    --size: 18px;

    display: flex;
    align-items: center;
    justify-content: center;

    height: var(--size);
    width: var(--size);
    border: 1px solid var(--el-color-primary);
    border-radius: 50%;
    box-shadow: #000 0px 0px 3px;

    background-color: #0f05;
    &.gt1 {
      background-color: radial-gradient(
        circle at center,
        transparent 50%,
        var(--color) 50%
      );
    }
    &.gt30 {
      background-color: radial-gradient(
        circle at center,
        transparent 50%,
        var(--color) 50%
      );
    }
    &.gt50 {
      background-color: radial-gradient(
        circle at center,
        transparent 50%,
        var(--color) 50%
      );
    }
  }

  // User Marker样式定义
  // :deep(.log-marker) {
  //   --size: 18px;

  //   display: flex;
  //   align-items: center;
  //   justify-content: center;

  //   height: var(--size);
  //   width: var(--size);
  //   border: 1px solid #0f0c;
  //   border-radius: 50%;
  //   box-shadow: #000 0px 0px 3px;

  //   background-color: #0f05;
  //   &.gt1 {
  //     background-color: #0f0a;
  //   }
  //   &.gt30 {
  //     background-color: #0f0c;
  //   }
  //   &.gt50 {
  //     background-color: #0f0f;
  //   }
  // }
}
</style>
