import { RouteLocationNormalized } from 'vue-router'
import useStore from '@/hooks/useStore'

const store = useStore()

/**
 * @description: 设置缓存
 */
export default function (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
): void {
  const toPageName = (to.name || '').toString()
  const fromPageName = (from.name || '').toString()
  // 设置缓存
  if (to.meta.keepAlive && toPageName) {
    const cacheModuleName = store.getters['app/getterCacheModuleName']
    if (!cacheModuleName.includes(toPageName)) {
      store.dispatch('app/setCacheModuleName', toPageName)
      // 存一份该缓存记录，用于当该页面回退后，清除缓存
      store.dispatch('app/setCacheHistory', {
        keepAlivePath: to.fullPath,
        fromPath: from.fullPath,
      })
      console.log(
        'add-当前缓存的模块名：',
        store.getters['app/getterCacheModuleName'],
      )
    }
  }
  // 清除缓存
  if (from.meta.keepAlive && fromPageName) {
    const cacheModuleName = store.getters['app/getterCacheModuleName']
    const cacheHistory = store.getters['app/getterCacheHistory']
    const isExistingModuleName = cacheModuleName.includes(fromPageName)
    const targetHistory = cacheHistory.find(
      (item) =>
        item.keepAlivePath === from.fullPath && item.fromPath === to.fullPath,
    )
    if (isExistingModuleName && targetHistory) {
      store.dispatch('app/deleteCacheModuleName', fromPageName)
      store.dispatch('app/deleteCacheHistory', {
        keepAlivePath: from.fullPath,
        fromPath: to.fullPath,
      })
      console.log(
        'delete-当前缓存的模块名：',
        store.getters['app/getterCacheModuleName'],
      )
    }
  }
}
