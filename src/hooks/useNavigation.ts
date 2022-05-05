import { RouteLocationRaw, useRouter } from 'vue-router'
import { getGlobal, setStorage, getStorage } from '@/utils/tools/index'

interface UseNavigation {
  navigateBack: (callback?: () => void) => void
  saveFirstRecord: () => void
  navigateTo: (to: RouteLocationRaw, type?: 'push' | 'replace') => void
  navigateGo: (delta: number) => void
}

export default (): UseNavigation => {
  const router = useRouter()

  // 记录第一次访问的页面，用于判断返回是调用原生的方法还是 history.go()
  const saveFirstRecord = () => {
    if (history.length <= 1) {
      setStorage('first-page', window.location.href)
      console.log('存储第一页:', getStorage('first-page'))
    }
  }

  const navigateBack = (callback?: () => void) => {
    if (typeof callback == 'function') {
      callback()
    }
    const firstPageUrl = getStorage('first-page')
    if (firstPageUrl === window.location.href) {
      // 调用原生端方法返回界面
      const global = getGlobal()
      if (global.dsBridge) {
        global.dsBridge.call('back')
      }
    } else {
      router.go(-1)
    }
  }

  const navigateTo = (
    to: RouteLocationRaw,
    type: 'push' | 'replace' = 'push',
  ) => {
    router[type](to).catch((err) => {
      console.log(err)
    })
  }

  const navigateGo = (delta: number) => {
    router.go(delta)
  }

  return {
    saveFirstRecord,
    navigateBack,
    navigateTo,
    navigateGo,
  }
}
