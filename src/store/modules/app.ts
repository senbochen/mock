import { ActionContext } from '@/typings/vuex'
import { getPlatform } from '@/utils/tools/index'

export interface AppModuleState {
  cacheModuleName: string[]
  cacheHistory: {
    keepAlivePath: string
    fromPath: string
  }[]
  routeTransitionDone: boolean // 路由过度动画是否执行完毕
}

export default {
  namespaced: true,
  state: (): AppModuleState => {
    return {
      cacheModuleName: [],
      cacheHistory: [],
      routeTransitionDone: getPlatform() === 'IOS' ? true : false,
    }
  },
  getters: {
    getterCacheModuleName: (state: AppModuleState): string[] => {
      return state.cacheModuleName
    },
    getterRouteTransitionDone: (state: AppModuleState): boolean => {
      return state.routeTransitionDone
    },
    getterCacheHistory: (
      state: AppModuleState,
    ): Array<{
      keepAlivePath: string
      fromPath: string
    }> => {
      return state.cacheHistory
    },
  },
  mutations: {
    SET_CACHE_MODULE_NAME(state: AppModuleState, name: string): void {
      state.cacheModuleName.push(name)
    },
    DELETE_CACHE_MODULE_NAME(state: AppModuleState, name: string): void {
      const deleteIndex = state.cacheModuleName.findIndex(
        (item) => item === name,
      )
      if (deleteIndex > -1) {
        state.cacheModuleName.splice(deleteIndex, 1)
      }
    },
    CLEAR_CACHE_MODULE_NAME(state: AppModuleState): void {
      state.cacheModuleName = []
    },
    SET_CACHE_HISTORY(
      state: AppModuleState,
      data: {
        keepAlivePath: string
        fromPath: string
      },
    ): void {
      state.cacheHistory.push(data)
    },
    DELETE_CACHE_HISTORY(
      state: AppModuleState,
      data: {
        keepAlivePath: string
        fromPath: string
      },
    ): void {
      const deleteIndex = state.cacheHistory.findIndex(
        (item) =>
          item.keepAlivePath === data.keepAlivePath &&
          item.fromPath === data.fromPath,
      )
      if (deleteIndex > -1) {
        state.cacheHistory.splice(deleteIndex, 1)
      }
    },
    CLEAR_CACHE_HISTORY(state: AppModuleState): void {
      state.cacheHistory = []
    },
    SET_ROUTE_TRANSITION_DONE(state: AppModuleState, data: boolean): void {
      state.routeTransitionDone = data
    },
  },
  actions: {
    setCacheModuleName(
      { commit }: ActionContext<AppModuleState>,
      name: string,
    ): void {
      commit('SET_CACHE_MODULE_NAME', name)
    },
    deleteCacheModuleName(
      { commit }: ActionContext<AppModuleState>,
      name: string,
    ): void {
      commit('DELETE_CACHE_MODULE_NAME', name)
    },
    clearCacheModuleName({ commit }: ActionContext<AppModuleState>): void {
      commit('CLEAR_CACHE_MODULE_NAME')
    },
    setCacheHistory(
      { commit }: ActionContext<AppModuleState>,
      data: {
        keepAlivePath: string
        fromPath: string
      },
    ): void {
      commit('SET_CACHE_HISTORY', data)
    },
    deleteCacheHistory(
      { commit }: ActionContext<AppModuleState>,
      data: {
        keepAlivePath: string
        fromPath: string
      },
    ): void {
      commit('DELETE_CACHE_HISTORY', data)
    },
    clearCacheHistory({ commit }: ActionContext<AppModuleState>): void {
      commit('CLEAR_CACHE_HISTORY')
    },
    setRouteTransitionDone(
      { commit }: ActionContext<AppModuleState>,
      data: boolean,
    ): void {
      commit('SET_ROUTE_TRANSITION_DONE', data)
    },
  },
}
