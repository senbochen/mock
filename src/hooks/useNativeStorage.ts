/**
 * @description 原生端 storage
 */
import { getGlobal } from '@/utils/tools/index'

interface UseNativeStorage {
  setDataToNative: (key: string, value: string) => Promise<void>
  getDataFromNative: (key: string) => Promise<{ value: string }>
}

export default (): UseNativeStorage => {
  const global = getGlobal()
  const bridge = global.dsBridge
  const prefix = 'kf-marketing-tools'

  const setDataToNative = (key: string, value: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      if (bridge) {
        bridge.call(
          'saveDeviceStorage',
          { seq: 1, key: `${prefix}-${key}`, value },
          (res: AppData) => {
            const { success, message } = res
            // console.log('set----', res)
            if (!success) {
              reject(message)
            }
          },
        )
      } else {
        reject('无法获取 bridge 实例')
      }
    })
  }

  const getDataFromNative = (key: string): Promise<{ value: string }> => {
    return new Promise((resolve, reject) => {
      if (bridge) {
        bridge.call(
          'fetchDeviceStorage',
          { seq: 1, key: `${prefix}-${key}` },
          (res: AppData) => {
            const { success, message, result } = res
            if (!success) {
              reject(message)
            } else {
              resolve(result as { value: string })
            }
          },
        )
      } else {
        reject('无法获取 bridge 实例')
      }
    })
  }

  return {
    setDataToNative,
    getDataFromNative,
  }
}
