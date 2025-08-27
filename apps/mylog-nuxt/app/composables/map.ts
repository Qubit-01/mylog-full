import '@amap/amap-jsapi-types'
// import AMapLoader from '@amap/amap-jsapi-loader'

type AMap = typeof globalThis.AMap
// @ts-ignore
globalThis._AMapSecurityConfig = {
  serviceHost: 'https://mylog.ink/_AMapService', // 访问密钥的接口
  // securityJsCode: "85b229327c63ab4ff844930144442d80", // 安全JS代码，明文传输才用
}

/** 获取高德地图实例(loader内部是单例的) loader不能运行在服务端会报错 */
export const getAMap = async () => {
  try {
    const AMapLoader = await import('@amap/amap-jsapi-loader')
    return (await AMapLoader.load({
      key: '3e157c0915ab643cb42b74eb4c943cf5',
      version: '2.0',
      plugins: [
        'AMap.CitySearch',
        'AMap.Geolocation',
        'AMap.Geocoder',
        'AMap.MarkerCluster',
        // 'AMap.Scale',
      ],
    })) as AMap
  } catch (e) {
    console.error('AMap> loader出错，避免在服务端运行：', e)
  }
}
if (!import.meta.env.SSR) getAMap() // 会在 window 上挂 AMap

/**
 * LngLat类型坐标转换为Vector2类型坐标，如果传入不是LngLat，就原样输出
 * @param p LngLat类型坐标
 * @returns Vector2类型坐标，就是 [number, number]
 */
export const l2v = (p: AMap.LngLat): AMap.Vector2 => [p.lng, p.lat]
