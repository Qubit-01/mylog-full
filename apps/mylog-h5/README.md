# MyLog 2

使用 Vue3 + TS + Pinia + Element Plus 重构 Mylog 项目。推荐用 `pnpm` 运行。

网站名称待定： My Multi Media Log 万象录 多元记 知行台  
网站域名待定： pro(已被注册)、ink、pub、run、plus

## 启动本项目

### 注意点

vite启用了https配置，但是证书我是肯定不能给你滴，你要是想跑起来这个项目，就去vite配置里面把https配置删了  
证书在我服务器 nginx目录的cert下，直接复制到项目根目录下即可  


## 旧项目的缺陷

- 不断开发功能，导致项目结构没有构思，乱。
- blog 和 note 功能其实可以合成为一个功能，因为他们的功能和数据结构大致是相同的，note 比 blog 更“大”，可以直接合成为一个功能，减少开发压力。
- 分享功能的 id 数组是明文的显示在 url 参数中，导致其他用户修改 url 参数中的 id 即可访问用户其他公开的 log
- 点赞功能不好高性能得实现，2 中采用空间换时间的方式，在两张表里面加入数据。
- 旧项目中，COS没有做权限限制，全开的公有读私有写，一直在破产边缘徘徊。并且文件结构不科学，不好统计用户占用空间，对后期开发和扩展不友好。

下面对旧项目每个痛点描述解决方案。


## 项目文件组织结构
src下的源代码结构
- api 项目接口，全是Promise，用到 utils/request.ts
- assets
  - markdown 后期MD文档的主题样式文件
  - themes 主题css，目前只有明暗主题。todo: 后期定义好变量名后可以由用户自定义
- components
  - Log log模块的相关组件
  - MainView 页面主要架构的相关组件
  - Pages 一级页面要使用的组件，且几乎只有这个页面才用得到，否则不应放在此目录下
  - Utils 工具类组件
- stores
  - constant.ts 整个项目使用的常量，不依赖于其他任何文件和变量
  - global.ts 全局store，包含了用户信息，页面明暗主题等
  - log.ts LogStore，包含了Home页和Mylog页的Log列表和Log的相关方法（发布、删除、编辑等）
- utils
  - cos.ts COS对象和相关封装的方法
  - img.ts 目前是图片压缩要用的相关方法
  - index.ts 离散的零碎的工具方法
  - map.ts 高德地图的实例对象和相关封装方法
  - request.ts 封装的Axios请求方法
- views 一级页面
  - 404 路由找不到，全部重定向到这个页面
  - home 主页
  - logger 我的主页，用户页。这个页面只展示用户公开的log
  - login 登陆、注册页
  - map 大地图页
  - mylog 编辑、展示log页，会展示全部log的页面
- App.vue


## 数据表

### 视图

log表中承载了全部log，由于目前不会复杂的查询，所以很适合分成多个视图，简化SQL语句编写，提高数据安全性，限制系统漏洞造成的数据损失。  

- public视图，`type='public'` 公开表，筛选出所有用户公开的log，发送时间排序（但是在logger页面时，后端要以记录时间排序）
- mylog视图，`type='public' or type='log'` 用户Mylog表，记录时间排序
- tag视图，`type='tag'` Tag表，日历里面的tag信息，记录时间排序


### 合并 note 表和 blog 表

以前主要是两张表存数据 note 和 blog:  
note 有 id, userid, username, type, time, sendtime, content, imgs, videos, audios, files, location, people, tags, info  
blog 有 id, userid, username, type, time, content, data, label, info, ~~tittle~~

现在合并为一张表 log 表，主要字段有：  
去除 tittle 字段，将其加入 info 中，原因：以前是为了 blog 好看设置了 tittle，现在发现不需要了  
以前 blog 的 label（就是分类：xy 校园，js 技术，qt 其他，wx 文学，yl 娱乐），现在归为 tags  
以前存储 json 字符串 用的 mediumtext(16MB)，现在换成 json(支持 4GB)  
type 是 log 的类型，以前区分 blog(null, md, pc)和 note(tag，todo，null)，但是现在不区分 blog 和 note 了，所以取值: `null | md | pc | tag | todo | pulic`

```sql
id bigint 唯一标识log,
userid bigint 对应的用户id,
username varchar(255) 对应的用户名,
type varchar(50) log的类型，区分blog(null, md, pc)和note(tag，todo，null),
sendtime datetime 发送时间,
logtime datetime 发生时间,
content longtext 内容,
tags json 标签数组，包括blog的分类,
imgs json 图片数组,
videos json,
audios json,
files json,
location json,
people json,
info json 包含一些杂项，不太会用它筛选，不会操作它（要操作就整体操作），归为一个json。如tittle,
```

## 注意点

### Type 字段

空: 以前直接 blog 发的，和 note 直接发的
pc: 爬虫爬取的数据
md: markdown 类型的数据，标识 content 是 markdown 格式
public: 被选择公开的 note
tag: 这是日历上的一个 tag
todo: 废弃，以前是待办事项，应该加进 log 的 tags 中

现在

- public: 公开的 log
- log: 普通的私有 log
- tag： 日历的元素

注释

- md 类型的，放在 info 中，markdown: true 则为。
- 现在 type 不会为空，type 默认都是 log，爬虫的数据默认为 public
- 现在首页展示 public



## COS 文件存储服务

- 加入了CDN加速，现在读取图片、视频、文件等更加快速
- 更新了文件存储结构，现在每个用户的有自己的文件域，更便于管理
- 加入了权限控制，文件只能在本网站并通过CDN读取，用户只能写操作自己的文件域，文件存储更安全

文件结构：`users/[用户 id]/[项目]/[文件类型]/[YYMMDD_HHmmss]_[编号]-源文件名`  
不同类型文件夹：compress-imgs, imgs, audios, files, videos, recycle  
如：users/1/mylog/compress-imgs/1666071890799-0.jpg


## 发布和编辑Log逻辑梳理

这方面逻辑有点复杂，主要是：  
- 发布和编辑逻辑要尽量统一且兼容，这点主要是为了兼容组件。

LogEdit 和 LogRelease 组件控制两个逻辑  
这两个组件要管理 logEdit（要发送的编辑数据），files（要上传的文件）

先说编辑组件，编辑的逻辑：
现有源log，新建一个logEdit = {}
用户打开一个编辑项，就去log中深拷贝这个属性值进logEdit
用户关闭一个编辑项，就 delete logEdit.type

编辑组件的显示由什么控制？visible（不能用数据项来if，因为空串为false）

文件编辑的组件的逻辑
父组件先给logEdit赋值，再使编辑组件显示
组件内部（用video举例）
先videos的model接收logEdit.videos，组件内用videosOld深拷贝一下
再 filesModel接收整个files对象，操作里面的videos项，这就是El文件对象
组件内 用 old数组渲染已有，只能删除，用files渲染要上传的
watch中监视 videosOld, () => filesModel.value.videos.length 两个数据
对两个进行拼接，

如果用户关闭编辑组件显示，就删除对应数据项，不用再onUnmouted了
组件只能打开其他编辑组件和加入文件

没有涉及的字段就不传，让后端来填充：空数组或者当前时间
文件名列表由组件内部控制

图片编辑组件既能给logEdit赋值，又能朝其他文件里面放文件


## 下面写一些作者的心得和怕忘记的东西

### 一些 element 的操作

```js
// main.ts 自定义主题css
import 'element-plus/theme-chalk/dark/css-vars.css'
import './styles/dark/css-vars.css'  // 自己新建一个css文件，在官方的后面导入即可覆盖
html.dark { // 里面的样式自己覆盖
  --el-bg-color: #626aef; /* 自定义深色背景颜色 */
}
```

### 要慎重考虑的东西

1. 命名
文件、文件夹、组件、变量、方法名等  
我的命名规则是把事物的本质作为第一个单词，修饰放在后面，在字典排序的编辑器中看起来就很更加美观  
文件夹名，应该遵循文件夹路径中没有重复意义的原则，就是一个路径里，文件夹名和文件名都携带着一些信息，且不重复  

2. 文件结构
不管是项目的文件结构，还是用户的文件结构都要长远的思考，保证开闭原则。  
对于项目中的敏感信息，要单独开个文件配置，并且要加入git忽略文件中，防止外传。  
对于用户文件结构，以用户为中心，用户的文件夹是错综复杂的，但是项目会上传的文件却是可以由开发者有序组织的，所以用户文件夹的优先级更高  

3. 扩展性
在功能模块开发前，就要思考组件是否有可能被复用，既然要复用，那么数据类型的兼容性是否就要适量扩展？  
要有长远的思考，才能是组件逻辑更加优雅简洁。尽量从开始就设计好，避免后期修改，修改组件会增加成为屎山的概率  

### 勉强能吹的技术点

- 后端：SpringBoot、CDN、OSS文件服务（权限控制）、跨域配置、https 2.0
- 技术栈：Vue 3.4
- 文件上传


