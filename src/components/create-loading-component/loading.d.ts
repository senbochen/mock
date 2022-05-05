import { Ref, VNode } from 'vue'

export interface LoadingOptions {
  visible: boolean
  target?: HTMLElement
  parent?: HTMLElement
  text?: string | null // loading 的文案
  background?: string | null // 背景色
  iconSize?: number | string | null // loading图标大小
  textSize?: number | string | null
  iconType?: 'spinner' | 'circular' | null // loading icon 的类型
  color?: string | null // 颜色
  vertical?: boolean | null // 是否是垂直排列
  lock?: boolean | null // 是否不允许父级容器滚动
  toast?: boolean | null // 是否是toastLoading
}

export interface ComponentSetupConfig {
  visible: Ref<boolean>
  target?: Ref<string | HTMLElement | undefined>
  parent?: Ref<HTMLElement | undefined>
  text?: Ref<string | null | undefined>
  textSize?: Ref<number | string | null | undefined>
  background?: Ref<string | null | undefined>
  iconSize?: Ref<number | string | null | undefined>
  iconType?: Ref<string | null | undefined>
  color?: Ref<string | null | undefined>
  vertical?: Ref<boolean | null | undefined>
  lock?: Ref<boolean | null | undefined>
  fullscreen?: Ref<boolean | null | undefined>
  toast?: Ref<boolean | null | undefined>
  close: () => void
  handleAfterLeave: () => void
}

export interface LoadingInstance extends ComponentSetupConfig {
  vm: VNode | null
  $el: HTMLElement | null
}
