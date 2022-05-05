export interface InfoInterface {
  code: string
  msg: string | ((msg: string) => string)
  isLogin: boolean
  reason?: (msg: string) => string
}
export const FREEZE_CODE = 'E0031' // 登录时冻结的状态码
export const SYSTEM_LOGOUT_LIST: InfoInterface[] = [
  {
    code: 'E0021',
    msg: (msg: string) => msg,
    isLogin: true,
  },
  {
    code: 'E0022',
    msg: '您的账号因长时间未操作被登出',
    isLogin: true,
  },
  {
    code: 'E0023',
    msg: '您的账号因修改了密码被登出',
    isLogin: true,
  },
  {
    code: 'E0024',
    msg: '您的账号因冻结被登出',
    isLogin: false,
    reason: (msg: string) => `冻结原因：${msg}`,
  },
  {
    code: 'E0025',
    msg: '您的账号因离职被登出',
    isLogin: false,
    reason: (msg: string) => `离职原因：${msg}`,
  },
  {
    code: 'E0033',
    msg: '您的访问权限已变更，请重新登录',
    isLogin: true,
  },
]
export const SYSTEM_LOGOUT_STATUS = SYSTEM_LOGOUT_LIST.map(
  (item: Record<string, any>) => item.code,
) // 系统登出状态码
export const GLOBAL_LOGOUT_STATUS = ['E0008', 'E0019'] // 全局登出状态码
export const WATERPROOF_WALL_STATUS = 'E0032' // 防水墙的状态码
export const SENSITIVITY_STATUS = 'E0034' // 敏感词
export const SUCCESS_STATUS = 'C0000'
