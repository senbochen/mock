type ElementType = Element | HTMLElement

const getTextWidthFunction = (text: string, font?: number) => {
  let width = 0
  const html = document.createElement('span')
  html.innerText = text
  html.style.fontSize = font + 'px'
  html.className = 'getTextWidth'
  document.querySelector('body')?.appendChild(html)
  width = html?.offsetWidth
  document.querySelector('.getTextWidth')?.remove()
  return width
}
const swiperEnter = (params: Record<string, any>, ...rest: any[]) => {
  const target = rest[1]
  const dom = target.target as any
  const text = rest[0]
  console.log(getTextWidthFunction(text, 40), dom?.offsetWidth)
  if (getTextWidthFunction(text) > dom?.offsetWidth) {
    dom.style.textOverflow = 'clip'
    const span = document.createElement('p')
    span.innerText = text.repeat(3)
    dom.innerText = ''
    !dom.childNodes.length && dom.appendChild(span)
    span.classList.add('animation')
    span.style.width = getTextWidthFunction(dom.innerText) + 'px'
  }
}

const swiperLeave = (params: Record<string, any>, ...rest: any[]) => {
  const target = rest[1]
  const dom = target.target as any
  dom.classList.remove('animation')
  dom.innerText = rest[0]
  dom.style.textOverflow = 'ellipsis'
}

const vSwiper = {
  mounted(el: any, params: Record<string, any>): any {
    const text = el?.innerText
    el.addEventListener('mouseenter', swiperEnter.bind(null, params, text))
    el.addEventListener('mouseleave', swiperLeave.bind(null, params, text))
  },
  unmounted(el: ElementType): void {
    el.removeEventListener('mouseenter', swiperLeave)
    el.addEventListener('mouseleave', swiperEnter)
  },
}

export default vSwiper
