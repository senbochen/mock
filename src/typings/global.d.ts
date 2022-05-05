declare type ObjectType = Record<string, any>

declare interface AppData {
  success: boolean
  seq: number
  message: string
  result: Record<string, any>
}

declare type RouteMeta = {
  transitionName?: string // 路由的过度动画如果不传默认是slide-fade
  keepAlive?: boolean // 当前页面是否缓存
  independent?: boolean // 不需要路由拦截的校验的页面，请将该属性设置为 true
}

declare namespace FetchResponse {
  interface Response<T = any> {
    message: string
    result: T
    status: string
  }
}

declare type ResType<T> = FetchResponse.Response<T>

declare interface PaginationType<T> {
  items: Array<T>
  recordCount: number
  pageSize: number
  currentPage: number
  pageCount: number // 总页数
  queryRecordCount: boolean // 是否查询总条数
}
