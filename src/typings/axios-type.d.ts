export declare module 'axios' {
  interface CustomAxiosRequestConfig {
    requestAbort?: (errorMsg: string) => void // 中断请求的回调
    resetCancelToken?: () => void // 重置请求的cancelToken
    type?: string
    noAlert?: boolean //是否关闭接口异常的错误提示
  }
}
