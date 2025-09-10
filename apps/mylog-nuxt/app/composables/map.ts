import '@amap/amap-jsapi-types'
// import AMapLoader from '@amap/amap-jsapi-loader'

const isSSR = import.meta.env.SSR

const 天府广场: AMap.Vector2 = [104.065739, 30.657452]

// @ts-ignore
globalThis._AMapSecurityConfig = {
  serviceHost: 'https://mylog.ink/_AMapService', // 访问密钥的接口
  // securityJsCode: "85b229327c63ab4ff844930144442d80", // 安全JS代码，明文传输才用
}

/** 获取AMap单例，⚠️只能在客户端调用 */
const getAMap = (): Promise<AMap> =>
  import('@amap/amap-jsapi-loader').then((loader) =>
    loader.load({
      key: '3e157c0915ab643cb42b74eb4c943cf5',
      version: '2.0',
      plugins: [
        'AMap.CitySearch',
        'AMap.Geolocation',
        'AMap.Geocoder',
        'AMap.MarkerCluster',
        // 'AMap.Scale',
      ],
    }),
  )

/** 获取高德地图实例(loader内部是单例的) loader不能运行在服务端会报错 */
// @ts-ignore
export const AMap: AMap = !isSSR ? await getAMap() : null

/** LngLat类型坐标转换为Vector2类型坐标 */
export const l2v = (p: AMap.LngLat): AMap.Vector2 => [p.lng, p.lat]

/****************
 * 定位
 * Ip定位
 * - getCityByIp 获取城市，不要权限，可能为空
 * Geo定位
 * - getPositionByGeo 获取当前精确位置，要权限
 * - getCityInfoByGeo 获取城市信息，不要权限，不会为空
 ****************/

/**
 * 公共的定位对象(全局唯一)，即是公共定位工具，也是地图当前坐标Marker
 * 浏览器定位对象，用的比较多，这里直接抽出来，构造时浏览器不会发起询问，调用方法时会
 * 融合了浏览器定位、高精度IP定位、安卓定位sdk辅助定位等多种手段，提供了获取当前准确位置、获取当前城市信息、持续定位(浏览器定位)等功能。
 * 默认情况下，PC端先精确IP定位，失败后浏览器定位；手机端先浏览器定位，失败后IP定位
 * @see https://lbs.amap.com/api/javascript-api-v2/documentation#geolocation
 */
// @ts-ignore
const Geolocation: AMap.Geolocation = !isSSR
  ? new (await getAMap()).Geolocation({
      enableHighAccuracy: true, // 是否使用高精度定位，默认：true
      timeout: 10000, // 设置定位超时时间，默认：无穷大
      // convert: true, //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
      // getCityWhenFail: true, // 定位失败之后是否返回基本城市定位信息
      needAddress: true, // 是否需要将定位结果进行逆地理编码操作
      // extensions: 'all', // 是否需要详细的逆地理编码信息,是否需要周边POI、道路交叉口等信息，默认为'base'只返回基本信息，可选'all',将返回周边POI、道路交叉口等信息
      showButton: false, // 是否显示定位按钮，true
      // buttonPosition: 'LB', // 定位按钮可停靠的位置 LT左上角 LB左下角 RT右上角 RB右下角 默认LB
      // buttonOffset: Pixel(10,20) // 按钮距离停靠位置的偏移量 默认Pixel(10,20)
      // showMarker: false, // 定位成功时是否在定位位置显示一个Marker true
      // showCircle: true, //定位成功后用圆圈表示定位精度范围，默认：true
      panToLocation: false, // 定位成功后，是否把定位得到的坐标设置为地图中心点坐标 true
      // zoomToAccuracy: false,  // 定位成功且显示精度范围时，是否把地图视野调整到正好显示精度范围 false
    })
  : null

/**
 * IP定位: 根据IP返回对应城市信息。不要权限，但有代理时不会返回结果
 * @param ip 指定ip查询，可以不传，就自动获取ip
 * @returns Promise<{bounds.getCenter()才是中心点, ...}>
 * @see https://lbs.amap.com/api/javascript-api-v2/documentation#citysearch
 * status:
 *   complete => result为CitySearchResult
 *   error => result为错误信息info
 *   no_data => 代表检索返回0结果，result空对象
 */
export const getCityByIp = async (ip?: string) =>
  new Promise<AMap.CitySearchResult>((resolve, reject) => {
    const citySearch = new AMap.CitySearch()
    const cb = (status: string, result: AMap.CitySearchResult) => {
      console.info('getCityByIp', status, result)
      if (status === 'complete' && result.info === 'OK') resolve(result)
      else reject({ status, result })
    }
    ip ? citySearch.getCityByIp(ip, cb) : citySearch.getLocalCity(cb)
  })

/**
 * 获取精确位置，有失败几率，浏览器定位，要权限。有几率失败，可能是因为没给权限
 * 并且 getCurrentPosition 方法会触发地图展示当前坐标
 * @param 可以自己传入，没有权限时，不会有坐标
 * @return Promise<{position坐标对象, ...}>
 * error =>
 *     message: "Get ipLocation failed.Geolocation permission denied."
 *     originMessage: "User denied Geolocation"
 */
export const getPositionByGeo = (gl: AMap.Geolocation = Geolocation) =>
  new Promise<{ position: AMap.LngLat }>(async (resolve, reject) => {
    gl.getCurrentPosition((status: string, result: any) => {
      console.info('getPositionByGeo', status, result)
      status === 'complete' ? resolve(result) : reject({ status, result })
    })
  })

/**
 * 获取当前城市信息，浏览器定位，不要权限。而且在使用代理时，也会通过ip返回结果，有几率失败
 * @returns Promise<{position坐标数组, ...}>
 */
export const getCityInfoByGeo = (gl: AMap.Geolocation = Geolocation) =>
  new Promise<{ position: AMap.Vector2 }>(async (resolve, reject) => {
    gl.getCityInfo((status, result) => {
      console.info('getCityInfoByGeo', status, result)
      status === 'complete' ? resolve(result) : reject({ status, result })
    })
  })

/** 不管有没有权限都要给出一个坐标，天府广场兜底 */
export const getPosition = async (gl?: AMap.Geolocation) =>
  getPositionByGeo(gl)
    .then((res) => l2v(res.position))
    .catch(() =>
      getCityInfoByGeo(gl).then((res) => res.position as AMap.Vector2),
    )
    .catch(() => getCityByIp().then((res) => l2v(res.bounds.getCenter())))
    .catch(() => 天府广场)

/** 坐标转描述 */
export const getAddress = async (p: AMap.Vector2) => {
  const geocoder = new AMap.Geocoder({
    // city: '',
    // radius: 1000,
    // batch: false,
    // extensions: 'all',
  })
  return new Promise<any>((resolve, reject) => {
    geocoder.getAddress(p, (status, result) => {
      status === 'complete' && result.info === 'OK'
        ? resolve(result.regeocode)
        : reject([status, result])
    })
  })
}

/**
 * 高德地图 Hook
 */
export const useAMap = (
  $map: Ref<HTMLDivElement | null>,
  opts?: Partial<AMap.MapOptions>,
  params?: {
    theme?: Ref<UserVO['setting']['page']['theme']>
  },
) => {
  let map: AMap.Map | null = null
  const state = reactive({ loading: true, message: '正在加载地图...' })
  const { promise: init, resolve } = Promise.withResolvers<AMap.Map>()

  /** 定位按钮控件，没有Marker，纯定位，会移动 */
  const geolocation = new AMap.Geolocation({
    enableHighAccuracy: true, //是否使用高精度定位，默认:true
    timeout: 10000, //超过10秒后停止定位，默认：无穷大
    panToLocation: false,
  })

  onMounted(async () => {
    map = new AMap.Map($map.value!, {
      zoom: 17, // 地图级别
      // center: 天府广场,
      mapStyle: `amap://styles/${
        params?.theme?.value === 'dark' ? 'dark' : 'normal'
      }`,
      ...opts,
    })

    geolocation.addTo(map)
    geolocation.hide()

    state.message = ''
    state.loading = false
    resolve(map)
  })

  // 自动切换地图样式
  params?.theme &&
    watch(params.theme, (theme) => {
      map?.setMapStyle(`amap://styles/${theme === 'dark' ? 'dark' : 'normal'}`)
    })

  onUnmounted(() => {
    map?.destroy()
  })

  return {
    map,
    /** init后，map对象应该被创建好 */
    init,
    /** 地图状态 */
    state,
    /** 定位控件 */
    geolocation,
  }
}

/** 类型定义 **********************************/

declare global {
  // @ts-ignore
  namespace AMap {
    interface CitySearchResult {
      bounds: AMap.Bounds
      city: string
      province: string
      info: string
    }

    interface Control {
      addTo(map: AMap.Map): void
      remove(): void
      show(): void
      hide(): void
    }

    /** IP定位 */
    class CitySearch {
      constructor()
      /** 获取城市，不要权限，可能为空 */
      getCityByIp(
        ip: string,
        callback: (status: string, result: CitySearchResult) => void,
      ): void
      getLocalCity(
        callback: (status: string, result: CitySearchResult) => void,
      ): void
    }

    /** 浏览器定位 */
    class Geolocation extends Control {
      constructor(options?: any)
      /** 配置项 */
      public _config: any
      /** 当前坐标的 Marker */
      public _marker: Marker
      getCurrentPosition(callback: (status: string, result: any) => void): void
      getCityInfo(callback: (status: string, result: any) => void): void
    }

    /** 地址解析 */
    class Geocoder {
      constructor(options?: any)
      getAddress(
        lnglat: any,
        callback: (status: string, result: any) => void,
      ): void
    }

    /** 点聚合 */
    class MarkerCluster {
      constructor(map: any, markers: any[], options?: any)
      // 可根据需要补充方法
    }
  }
}

export type AMap = typeof globalThis.AMap
/** 我自己定义的坐标类型 */
export type LngLatVO = [AMap.Vector2, string]
