/*
 *@description 全局注册的 mixin
 */
import { App } from 'vue'
import useStore from '@/hooks/useStore'

export default {
  install: (app: App): void => {
    app.mixin({
      methods: {
        checkPermissionMixin(
          data: string | string[],
          operator: 'some' | 'every' = 'every',
        ): boolean {
          const store = useStore()
          const permission =
            store.getters['user/getterUserInfo']?.menuFunctionList || []
          let result: string[] = []
          if (typeof data === 'string') {
            result = [data]
          } else {
            result = data
          }
          return result[operator]((item: string) => {
            return permission.includes(item)
          })
        },
      },
    })
  },
}
