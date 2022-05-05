import { nextTick } from 'vue'
import { createLoadingComponent } from './create-loading'
import { LoadingOptions, LoadingInstance } from './loading'
import { getStyle, hasClass, addClass } from '@/utils/dom'

const Loading = function (options: LoadingOptions): LoadingInstance {
  let parent = null
  if (options.target && options.target === document.body) {
    parent = document.body
  } else {
    parent = options.target as HTMLElement
  }
  options.parent = parent

  // 判断它父级是否有设置相对定位
  const parentStyle = getStyle(parent, 'position')
  let isRelativePosition = false
  if (parentStyle && ['relative', 'fixed', 'absolute'].includes(parentStyle)) {
    isRelativePosition = true
  }
  if (!isRelativePosition) {
    if (!hasClass(parent, 'kf-loading-parent--relative')) {
      addClass(parent, 'kf-loading-parent--relative')
    }
  }
  if (options.lock) {
    if (!hasClass(parent, 'kf-loading-parent--hidden')) {
      addClass(parent, 'kf-loading-parent--hidden')
    }
  }

  const instance = createLoadingComponent(options) as LoadingInstance
  instance.$el && parent.appendChild(instance.$el)

  nextTick().then(() => {
    instance.visible.value = 'visible' in options ? options.visible : true
  })

  return instance
}

export default Loading
