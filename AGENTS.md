# AGENTS

本仓库协作约定如下。

## 前端

### 布局

- 修改现有页面时，优先遵循当前页面结构，不要为了组件库而强行重排整体布局。
- 能用现有结构完成布局时，不要额外增加很多包装层 DOM。

### 组件

- 组件如果没有特殊需求，尽量保持单根节点。
- 组件根节点的 `class` 名默认与组件名一致，且大小写保持一致。
- 只有在确实有结构、语义、插槽、过渡或框架限制时，才打破单根节点或根节点类名约定。

### 样式

- 样式类名保持简洁、偏结构语义化，避免“平铺式 BEM/工具化命名”
- SCSS 优先按结构嵌套书写，从根节点往下展开。
- 样式先表达布局结构，再补局部视觉。
- 做前端改动时，优先保持实现克制，先把基础交互和结构做好，不要堆无用的 DOM、样式或动画。

### JavaScript / TypeScript

- JavaScript / TypeScript 中如果没有特殊需求，尽量使用箭头函数。
- 只有在更适合方法语义、函数提升、或框架约束时，再用 `function`。

### Nuxt 自动导入

- 在前端代码中，优先使用 Nuxt 自动导入；不要手写 `vue`、`element-plus`、`pinia` 等的导入语句。
- Vue 组合式 API 直接使用，例如 `ref`、`reactive`、`computed`、`watch`、`onMounted`、`unref`。
- Vue 编译宏直接使用，例如 `defineProps`、`defineEmits`、`withDefaults`。
- Nuxt helper 直接使用，例如 `useRuntimeConfig`、`useFetch`、`navigateTo`。
- `app/composables` 下导出的函数默认按 Nuxt 规则自动导入，优先直接使用。
- `app/components` 下的组件在模板里默认按 Nuxt 规则自动注册，优先直接使用，不要在 `script setup` 里手写导入。
- Element Plus 组件优先直接写在模板里使用。
- Pinia 相关基础 API 走自动导入。
- 只有类型、自动导入范围外的工具、或项目未接入自动导入的第三方模块，才手写导入。

## 后端

- 不用 Restful 风格
- 没有特殊需求的话，尽量都用 POST 接口
- 数据库表名用全小写

## 其他

- 注释、错误提示都用中文
- 不要删除原有代码的注释
