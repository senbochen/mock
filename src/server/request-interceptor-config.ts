import { AxiosRequestConfig } from 'axios'
import { getRandom } from '@/utils/tools/index'
import md5 from 'md5'

const X_VERSION = 'v1.0.0'
const PREFIX_STR = 'KFANG-HEADER'
const SUFFIX_STR = 'REQUEST@2021'

export const setRequestInterceptorParams = (
  cfg: AxiosRequestConfig,
  token: string,
): void => {
  const requestHeader = cfg.headers as Record<string, string>
  if (!requestHeader) {
    return
  }
  const times = Date.now()
  const random = getRandom(4)
  let mockToken = ''
  if (!token) {
    mockToken = getRandom(32)
  }
  const rule = {
    'x-version': X_VERSION,
    'x-time': times.toString(),
    'x-sid': token || mockToken,
    'x-rand': random,
  }

  requestHeader['x-version'] = X_VERSION
  requestHeader['x-time'] = times.toString()
  requestHeader['x-sid'] = token || mockToken
  requestHeader['x-sign'] =
    md5(PREFIX_STR + JSON.stringify(rule) + SUFFIX_STR) + random
}
