type ElementType = Element | HTMLElement
let text = ''
const getTextWidthFunction = (text: string, font: number) => {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d') as any
  context.font = font
  const metrics = context.measureText(text)
  console.log('metrics>>', metrics.width)
  return metrics.width
}
const swiperEnter = (params: Record<string, any>, ...rest: any[]) => {
  const target = rest[0]

  const dom = target.target as any
  if (!text) {
    text = dom.innerText
  }
  dom.style.textOverflow = 'clip'
  const span = document.createElement('p')
  span.innerText = text.repeat(3)
  dom.innerText = ''
  !dom.childNodes.length && dom.appendChild(span)
  span.classList.add('animation')
  span.style.width = getTextWidthFunction(dom.innerText, 14) + 'px'
}

const swiperLeave = (params: Record<string, any>, ...rest: any[]) => {
  const target = rest[0]
  const dom = target.target as any
  dom.classList.remove('animation')
  dom.innerText = text
  dom.style.textOverflow = 'ellipsis'
}

const vSwiper = {
  mounted(el: ElementType, params: Record<string, any>): any {
    el.addEventListener('mouseenter', swiperEnter.bind(null, params))
    el.addEventListener('mouseleave', swiperLeave.bind(null, params))
  },
  unmounted(el: ElementType): void {
    el.removeEventListener('mouseenter', swiperLeave)
    el.addEventListener('mouseleave', swiperEnter)
  },
}

export default vSwiper
