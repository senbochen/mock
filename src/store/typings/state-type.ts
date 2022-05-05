// 每个模块state的类型
import { AppModuleState } from '../modules/app'
import { UserModuleState } from '../modules/user'

export type RootState = {
  app: AppModuleState
  user: UserModuleState
}
