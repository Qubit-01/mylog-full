export function useTest() {
  const count = ref(0)

  return { count }
}

export function useMap() {
  const count = ref(0)

  return { count }
}

// export function useMap(
//     domRef: globalThis.Ref<HTMLDivElement | undefined>,
//     opts: any = {},
//     config: {
//       /**
//        * 是否禁用浏览器定位，默认开启
//        */
//       disableGeo?: boolean
//     } = {}
//   ) {

//     const map = ref<AMap.Map>()

//     const test = ref('123')

//     // const init = new Promise<AMap.Map>((resolve, reject) => {
//     //   onMounted(async () => {
//     //     // 会有 Canvas2D 警告
//     //     const rawMap = new AMap.Map(domRef.value!, {
//     //       zoom: 15, // 地图级别
//     //     //   center: await curLocation,
//     //       // mapStyle: 'amap://styles/whitesmoke', // 设置地图的显示样式
//     //       ...opts,
//     //     })

//     //     map.value = rawMap
//     //     resolve(rawMap)
//     //   })
//     // })

//     // onUnmounted(() => {
//     //   console.log('销毁地图')
//     //   map.value!.destroy()
//     // })

//     return { test } //map, init }
//   }
