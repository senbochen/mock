import { Store } from 'vuex'
import { RootState } from '@/store/typings/state-type'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: Store<RootState>
    checkPermissionMixin: (
      data: string | string[],
      operator: 'some' | 'every' = 'every',
    ) => boolean
  }
}
