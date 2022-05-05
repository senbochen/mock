import { InjectionKey } from 'vue'
import { createStore, Store, useStore as baseUseStore } from 'vuex'
import { RootState } from './typings/state-type'
import modules from './modules'

// 定义 injection key
export const key: InjectionKey<Store<RootState>> = Symbol()

export const store = createStore<RootState>({
  modules,
})

// 由于 vuex 原生的 useStore 只能支持 state 的校验，而commit，dispatch， getter 无法获取提示和校验，因此优先使用本项目自定义的useStore
export const useStore = <T = RootState>(): Store<T> => baseUseStore<T>(key)
