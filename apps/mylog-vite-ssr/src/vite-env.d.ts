/// <reference types="vite/client" />

declare interface Window {
  QC: QQConnect;
}

declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

/**
 * 图片压缩预设，目前是会压缩成webp格式，返回 Picture类型的对象
 */
declare module "*?preset=modern" {
  const src: import("vite-imagetools").Picture;
  export default src;
}

declare type Log = import("@mylog-full/mylog-trpc-prisma").LogVO;
declare type User = import("@mylog-full/mylog-trpc-prisma").UserVO;