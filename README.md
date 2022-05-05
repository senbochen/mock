# 项目说明

## 项目初始化

- 请先将 `npm` 的源切换至公司内网

```
npm config set registry http://nexus.kfang.com/npm/
```

- 安装脚手架

```
npm install kf-mobile-cli -g
```

- 执行以下命令

```
// 创建项目
kmc create xxx
```

- 脚手架的其他命令

```
kmc -V // 检查脚手架版本

kmc -C // 清除脚手架缓存

kmc create xxx -U // 先更新脚手架版本在创建项目
```

## 项目的环境变量

1. `NODE_ENV`： 环境变量（目前只有 `development` 和 `production`）

2. `VUE_APP_ENV_TYPE`: 环境类型，分别是 `test`(测试生产环境)，`development` (开发环境)，`production` (正式生产环境)

3. `VUE_APP_TEST_AK`: 测试环境中百度统计的 AK 值

4. `VUE_APP_PRODUCTION_AK`: 正式生产环境中百度统计的 AK 值

## 约定 API 的定义规则

为了在 `vue` 文件中，请求接口所返回的数据能够支持 `ts` 的类型校验，项目中 api 的目录结构如下：

    |-- api
        |-- delegation
            |-- index.ts
            |-- response.d.ts

例子：

```js
// api/delegation/index.ts

import request from 'axios'
import { ResAgentPage } from './response'

const prefix = '/web-infra-marketing'

// 分页查询委托列表
export const queryAgentPage = (params: { id: string }): ResAgentPage =>
  request({
    url: prefix + '/sharing/landlordEntrust/queryAgentPage',
    method: 'GET',
    params,
  })
```

```js
// api/delegation/response.d.ts
import { AxiosPromise } from 'axios'

// WAIT_DIAL("待联系"), FINISH_DIAL("已联系"), WAIT_EXPAND("待拓房"), FINISH_EXPAND("已拓房"),  FINISH_FAIL("拓房失败") OUT_OF_SCOPE("超出作业范围")
type EntrustStatus =
  | 'WAIT_DIAL'
  | 'FINISH_DIAL'
  | 'WAIT_EXPAND'
  | 'FINISH_EXPAND'
  | 'FINISH_FAIL'
  | 'OUT_OF_SCOPE'

export interface AgentPage {
  gardenName: string // 小区名
  entrustStatus: EntrustStatus // 委托状态
  userPhone: string // 手机号码
  channel: 'FRIENDS_CIRCLE' | 'FRIENDS' | 'IMAGES' | 'URL' // 访客来源 {FRIENDS_CIRCLE-朋友圈分享,FRIENDS-好友分享,IMAGES-图片分享,URL-url分享}
  price: string // 期望价格
  entrustType: 'SELL' | 'RENT' // 委托类型
  layout: string // 户型
  area: string // 面积
  newEntrust: 'YES' | 'NO' // 是否新委托
  buildingRoom: string // 楼栋房号
  region: string //区域
  userNickName: string // 用户昵称
  id: string // id
  userId: string // 用户id
  entrustDate: string // 委托时间
}

export type ResAgentPage = AxiosPromise<ResType<PaginationType<AgentPage>>>
```

注意：

`axios` 默认会自动对异常的状态码进行 `toast`,如果不需要提示，请在请求时将 `noAlert` 设置为 `true`

```js
request({
  url: prefix + '/sharing/landlordEntrust/queryAgentPage',
  method: 'GET',
  params,
  noAlert: true,
})
```

## 约定 Router 的定义规则

路由元信息的配置参数：

```js
declare type RouteMeta = {
  transitionName?: string // 路由的过度动画如果不传默认是slide-fade
  keepAlive?: boolean // 当前页面是否缓存
  /**
   * 不需要路由拦截的校验的页面，请将该属性设置为 true
   * 应用场景：
   *  1. 对于只在h5平台运行时，login 登录页不需要对其校验，因此要将其 router meta 设置为 independent: true
   *  2. 对于可以内嵌在app中运行，某些页面又支持在非 app 中的 webview 访问，这时也要将该页面的 router meta设置为 independent: true
   *
  */
  independent?: boolean
}
```

路由对象的配置结构如下：

```js
{
  path: '/exampleHome',
  name: 'ExampleHome',
  component: () =>
    import(/* webpackChunkName: "home" */ '../views/example/home.vue'),
  meta: {
    keepAlive: true,
  },
},
```

注意：

由于 `vue` 本身 `keepAlive` 的限制，这里的 `name` 必须和 `../views/example/home.vue` 组件的 `name` 属性保持一致

## vuex 的声明与使用

1. 声明

- state 的声明尽量使用函数的形式，便于以后多个 store 访问同一个 module，而导致的数据污染 [参考](https://next.vuex.vuejs.org/zh/guide/modules.html#%E6%A8%A1%E5%9D%97%E9%87%8D%E7%94%A8)

- 在声明一个 module 后请在 typings/state-type.ts 中的 RootState，填写相应的模块对应的类型

- 最后在 modules.ts 中引入该模块

2. 使用

- 由于 vuex 原生的 useStore 只能支持 state 的校验，而 commit，dispatch， getter 无法获取提示和校验，因此优先使用本项目自定义的 useStore

## 项目内置的组件

1. `base-scroll` 基于 `better-scroll` 封装的移动端滚动组件，支持上拉加载更多和下拉刷新，使用方法见 `src/views/example/home.vue`

## 项目内置的指令

1. 由于 `vant` 不支持 `loading` 组件已指令的形式调用，因此该项目提供一个 `v-loading` 的指令，支持全屏 loading 和局部 loading，，使用方法见 `src/views/example/detail.vue`

## 项目内置的 hooks

1. useLoadMore

   该`hook`集成了上拉加载更多和下拉刷新的业务处理逻辑，我们只需要将绑定的数组的类型以泛型的方式传入，并将请求接口的方法和调用方法的参数传入即可。使用方法见 `src/views/example/home.vue`

2. useNativeStorage

   该`hook`集成了原生端存储的功能

   eg:

   ```
   const { setDataToNative, getDataFromNative } = useNativeStorage()
   ```

3. useNavigation

   该`hook`集成了路由导航的全部功能，如果使用的页面是集成在 App 中，且这个页面有可能是 App 访问 H5 的入口页，这时点击返回的时候应该调用原生的回退，这时请在 onMounted 生命周期中调用 `saveFirstRecord` 方法

## 项目内置的 mixin

本项目提供一个全局的 `mixin` 用于权限的校验。

eg：

```html
<li v-if="checkPermissionMixin(item.permissionCode)"></li>
```

## 项目内置的 主题设置

关于`vant`主题设置，请在`src/styles/vant-theme.scss`中设置
