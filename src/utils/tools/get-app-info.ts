import { getGlobal } from './index'
import { Toast } from 'vant'
import useStore from '@/hooks/useStore'

interface AppData {
  success: boolean
  seq: number
  message: string
  result: Record<string, any>
}

const store = useStore()
let timer: any = null

// 初始化app的bridge
const getAppInfo = async (): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const global = getGlobal()
    const bridge = global.dsBridge
    // alert('从app中获取用户信息')
    if (bridge) {
      // 获取ksid
      bridge.call('getAccountInfo', { seq: 1 }, (res: AppData) => {
        const { success, result } = res
        if (timer) {
          clearTimeout(timer)
          timer = null
        }
        if (success) {
          if (!result.token) {
            Toast('无法获取用户的唯一标识')
            reject({ message: '无法获取用户的唯一标识' })
          } else {
            store.dispatch('user/setToken', result.token)
            // 存储用户信息
            store.dispatch('user/setUserInfo', result)
            resolve(true)
          }
        } else {
          Toast('无法获取用户信息')
          reject({ message: '无法获取用户信息' })
        }
      })
      timer = setTimeout(() => {
        Toast('获取用户信息超时')
        reject({
          message: '获取用户信息超时',
        })
      }, 2000)
    } else {
      reject({
        message: 'bridge is undefined',
      })
    }
  })
}

export default getAppInfo
