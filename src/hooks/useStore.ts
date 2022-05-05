import { store } from '../store/index'
import { RootState } from '../store/typings/state-type'
import { Getters, Commit, Dispatch } from '../store/typings/hooks-type'

interface UseStoreHooks {
  state: RootState
  getters: Getters
  commit: Commit
  dispatch: Dispatch
}

const useStore = (): UseStoreHooks => {
  const { state, getters, commit, dispatch } = store

  return { state, getters, commit, dispatch }
}

export default useStore
