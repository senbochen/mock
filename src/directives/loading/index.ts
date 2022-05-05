import Loading from '@/components/create-loading-component/index'
import { LoadingInstance } from '@/components/create-loading-component/loading'
import { isNull } from '@/utils/validate/base-type-validate'
interface ExtendsHTMLElement extends HTMLElement {
  instance: LoadingInstance
}

const createInstance = (
  el: ExtendsHTMLElement,
  binding: Record<string, any>,
) => {
  const text = el.getAttribute('kf-loading-text')
  const background = el.getAttribute('kf-loading-background')
  const iconSize = el.getAttribute('kf-loading-size')
  const textSize = el.getAttribute('kf-loading-text-size')
  const iconType = el.getAttribute('kf-loading-type') as 'spinner' | 'circular'
  const color = el.getAttribute('kf-loading-color')
  const verticalValue = el.getAttribute('kf-loading-text-vertical')
  let vertical = true
  if (!isNull(verticalValue)) {
    if (verticalValue === 'false') {
      vertical = false
    } else {
      vertical = true
    }
  }
  el.instance = Loading({
    target: binding.modifiers.fullscreen ? document.body : el,
    visible: true,
    text,
    background: binding.modifiers.toast ? 'transparent' : background,
    iconSize,
    textSize,
    iconType,
    color,
    vertical,
    lock: Boolean(binding.modifiers.lock),
    toast: Boolean(binding.modifiers.toast),
  })
}

const vLoading = {
  mounted(el: ExtendsHTMLElement, binding: Record<string, any>): void {
    if (binding.value) {
      createInstance(el, binding)
    }
  },
  updated(el: ExtendsHTMLElement, binding: Record<string, any>): void {
    const instance = el.instance
    if (binding.oldValue !== binding.value) {
      if (binding.value) {
        createInstance(el, binding)
      } else {
        instance.close()
      }
    }
  },
  unmounted(el: ExtendsHTMLElement): void {
    el?.instance?.close()
  },
}

export default vLoading
