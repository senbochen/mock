import { Router } from 'vue-router'
import useStore from '@/hooks/useStore'
import cached from './cached'
import getAppInfo from '@/utils/tools/get-app-info'

const store = useStore()

const createNavigationGuards = (router: Router): void => {
  router.beforeEach(async (to, from, next) => {
    const independent = to.meta.independent
    const userInfo = store.getters['user/getterUserInfo']
    // 设置缓存
    cached(to, from)

    // 判断页面是否需要逻辑判断
    if (independent) {
      next()
      return
    }

    if (!Object.keys(userInfo).length) {
      try {
        await getAppInfo()
        next()
      } catch (err) {
        console.log('用户信息error:', err)
        next('/refuse-page')
      }
    } else {
      next()
    }
  })
}

export default createNavigationGuards
