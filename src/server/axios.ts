/**
 * axios的拦截处理
 */
import axios, { AxiosResponse, AxiosError } from 'axios'
import { Toast, Dialog } from 'vant'
import { setRequestInterceptorParams } from './request-interceptor-config'
import { isNull } from '@/utils/validate/base-type-validate'
import { getGlobal } from '@/utils/tools/index'
import {
  InfoInterface,
  SYSTEM_LOGOUT_LIST,
  SYSTEM_LOGOUT_STATUS,
  GLOBAL_LOGOUT_STATUS,
  FREEZE_CODE,
  WATERPROOF_WALL_STATUS,
  SUCCESS_STATUS,
  SENSITIVITY_STATUS,
} from './code'
import useStore from '@/hooks/useStore'

let requestInterceptor: number | null
let responseInterceptor: number | null

// 添加header配置
axios.defaults.timeout = 60000

// 初始化axios的拦截器
function initInterceptors() {
  const store = useStore()
  // 创建中断请求
  let source = axios.CancelToken.source()

  if (!isNull(requestInterceptor) || !isNull(responseInterceptor)) {
    // 清除之前的拦截器
    if (typeof requestInterceptor === 'number') {
      axios.interceptors.request.eject(requestInterceptor)
    }
    if (typeof responseInterceptor === 'number') {
      axios.interceptors.response.eject(responseInterceptor)
    }
    requestInterceptor = null
    responseInterceptor = null
  }

  requestInterceptor = axios.interceptors.request.use(
    (config: any) => {
      const cfg = config
      const token = store.getters['user/getterToken']

      if (!cfg.cancelToken) {
        cfg.cancelToken = source.token
        cfg.requestAbort = (errorMsg: string) => {
          source.cancel(errorMsg)
          console.log('取消了请求', source.token.reason)
        }
      }

      cfg.resetCancelToken = () => {
        source = axios.CancelToken.source()
      }

      setRequestInterceptorParams(cfg, token)

      return cfg
    },
    (error: AxiosError) => {
      return Promise.reject(error)
    },
  )

  responseInterceptor = axios.interceptors.response.use(
    (response: AxiosResponse<FetchResponse.Response>) => {
      // 响应的处理逻辑
      const res = response
      const { requestAbort, resetCancelToken, noAlert } = res.config as any
      const { status, message } = res.data
      // 判断是否是流，排除文件下载请求会被reject出去、
      const contentType = res.headers['content-type']
      const isStream = contentType
        ? contentType.toLowerCase().indexOf('application/octet-stream') > -1
        : false

      console.log('status>>>>>', status)
      if (status !== SUCCESS_STATUS && !isStream && !!status) {
        if (!noAlert) {
          if (status === SENSITIVITY_STATUS) {
            Toast({
              message: `${message}为敏感词，不支持填入`,
              duration: 1500,
            })
          } else {
            Toast({
              message: message || '开小差了～',
              duration: 1500,
            })
          }
        }
        return Promise.reject({
          ...res.data,
          requestAbort,
          resetCancelToken,
        })
      }
      return res
    },
    (error: AxiosError<FetchResponse.Response>) => {
      const response = error.response
      if (response) {
        const code = response.status
        const { status, message } = response.data
        const { requestAbort, resetCancelToken } = response.config as any

        if (code === 403) {
          let showMessage = message

          if (GLOBAL_LOGOUT_STATUS.includes(status)) {
            showMessage = '登录已过期，请重新登录'
          } else if ([WATERPROOF_WALL_STATUS, FREEZE_CODE].includes(status)) {
            showMessage = '用户信息无效，请重新登录'
          } else if (SYSTEM_LOGOUT_STATUS.includes(status)) {
            const targetItem = SYSTEM_LOGOUT_LIST.find(
              (item: InfoInterface) => item.code === status,
            ) as InfoInterface

            showMessage =
              typeof targetItem.msg === 'string'
                ? targetItem.msg
                : targetItem.msg(message)
            if (targetItem.reason) {
              showMessage = showMessage + '\n' + targetItem.reason(message)
            }
          }

          Dialog.alert({
            message: showMessage,
            className: 'quit-application',
            confirmButtonText: '我知道了',
            confirmButtonColor: '#00B9EF',
          }).then(() => {
            // 调用原生端方法退出登录
            const global = getGlobal()
            if (global.dsBridge) {
              global.dsBridge.call('exitLogin')
            }
          })

          return Promise.reject({
            ...response.data,
            requestAbort,
            resetCancelToken,
          })
        }
      } else {
        return Promise.reject(error)
      }
    },
  )
}

initInterceptors()

export default axios
