type ElementType = Element | HTMLElement
let dom: ElementType
const operationClass = (dom: ElementType) => {
  if (dom) {
    dom.classList.contains('shake')
      ? dom.classList.toggle('moreover-shake')
      : dom.classList.toggle('shake')
  } else {
    return
  }
}

const shake = (params: Record<string, any>, ...rest: any[]) => {
  const target = rest[0]
  const className = params.value?.className || ''
  if (!className) {
    const dom = target.target as ElementType
    operationClass(dom)
  }
  if (className) {
    if (!dom) {
      dom = document.querySelector(`.${params.value?.className}`) as ElementType
    }
    operationClass(dom)
  }
}

const vShake = {
  mounted(el: ElementType, params: Record<string, any>): any {
    el.addEventListener('click', shake.bind(null, params))
  },
  unmounted(el: ElementType): void {
    el.removeEventListener('click', shake)
  },
}

export default vShake
