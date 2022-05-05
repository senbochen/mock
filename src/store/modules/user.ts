import { setStorage, getStorage, deleteStorage } from '@/utils/tools/index'
import { ActionContext } from '@/typings/vuex'

export interface UserModuleState {
  token: string
  userInfo: Record<string, any>
}

export default {
  namespaced: true,
  state: (): UserModuleState => {
    return {
      token: getStorage('token') || '',
      userInfo: {},
    }
  },
  getters: {
    getterToken: (state: UserModuleState): string => {
      return state.token
    },
    getterUserInfo: (state: UserModuleState): Record<string, any> => {
      return state.userInfo
    },
  },
  mutations: {
    SET_TOKEN(state: UserModuleState, data: string): void {
      state.token = data
    },
    SET_USER_INFO(state: UserModuleState, data: Record<string, any>): void {
      state.userInfo = data
    },
  },
  actions: {
    setToken({ commit }: ActionContext<UserModuleState>, data: string): void {
      commit('SET_TOKEN', data)
      setStorage('token', data)
    },

    setUserInfo(
      { commit }: ActionContext<UserModuleState>,
      data: Record<string, any>,
    ): void {
      commit('SET_USER_INFO', data)
    },

    clearData({ commit }: ActionContext<UserModuleState>): void {
      commit('SET_TOKEN', '')
      commit('SET_USER_INFO', {})
      deleteStorage('token')
    },
  },
}
