import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs' // element 国际化
import * as Icons from '@element-plus/icons-vue' // element 图标
import 'dayjs/locale/zh-cn' // element 用的dayjs要设置时区
import App from './App.vue'
import router from './views/router'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn' // 导入本地化语言
import customParseFormat from 'dayjs/plugin/customParseFormat' // 拓展 dayjs 支持自定义时间格式。
import { vM } from './utils/directives' // 自定义指令

import './assets/css/base.less' // 全局样式

// import 'default-passive-events' // 浏览器警告：解决移动端滚动卡顿问题

dayjs.locale('zh-cn') // 使用本地化语言
dayjs.extend(customParseFormat)

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus, { locale: zhCn })
app.use(router)

// 注册所有element图标组件
for (const [k, c] of Object.entries(Icons)) app.component(k, c)
// 注册指令：给元素加-m的class
app.directive('m', vM)

app.mount('#app')

// 去除浏览器输出
// -url:https://connect.qq.com/qc_jssdk.js 
// -Canvas2D
//
//