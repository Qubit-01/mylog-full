// import '@amap/amap-jsapi-types'
// import AMapLoader from '@amap/amap-jsapi-loader'

// @ts-ignore
globalThis._AMapSecurityConfig = {
  serviceHost: 'https://mylog.ink/_AMapService', // 访问密钥的接口
  // securityJsCode: "85b229327c63ab4ff844930144442d80", // 安全JS代码，明文传输才用
}

// const AMap: Promise<typeof globalThis.AMap> =

// export const getAMap = async () => {
//   try {
//     return await AMapLoader.load({
//       key: '3e157c0915ab643cb42b74eb4c943cf5',
//       version: '2.0',
//       plugins: [
//         'AMap.CitySearch',
//         'AMap.Geolocation',
//         'AMap.Geocoder',
//         'AMap.MarkerCluster',
//         // 'AMap.Scale',
//       ],
//     })
//   } catch (e) {
//     console.error('AMap> 地图加载出错', e)
//   }
// }
