type ElementType = Element | HTMLElement | null

const operationClass = (dom: ElementType) => {
  if (dom) {
    dom.classList.contains('shake')
      ? dom.classList.toggle('moreover-shake') && dom.classList.remove('shake')
      : dom.classList.toggle('shake') && dom.classList.remove('moreover-shake')
  } else {
    return
  }
}
const shake = (params: Record<string, any>, ...rest: Record<string, any>[]) => {
  const target = rest[0]
  const className = params?.params.value?.className || ''
  if (!className) {
    const dom = target.target as ElementType
    operationClass(dom)
  }
  if (className) {
    operationClass(params?.dom)
  }
}

const vShake = {
  mounted(el: ElementType, params: Record<string, any>): void {
    let dom: ElementType = null
    if (!dom) {
      dom = document.querySelector(`.${params.value?.className}`) as ElementType
    }
    el?.addEventListener('click', shake.bind(null, { params, dom }))
  },
  unmounted(el: ElementType, params: Record<string, any>): void {
    let dom: ElementType = null
    if (!dom) {
      dom = document.querySelector(`.${params.value?.className}`) as ElementType
    }
    el?.removeEventListener('click', shake.bind(null, { params, dom }))
  },
}

export default vShake
