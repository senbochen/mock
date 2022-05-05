const { name } = require('../../../package.json')

export const getGlobal = (): any => {
  return typeof window !== 'undefined' ? window : global
}

const global = getGlobal()
const storagePrefix = `kf-${name}-`

// 向本地存数据
export function setStorage(
  key: string,
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  data: any,
  type = 'sessionStorage',
): void {
  if (typeof data === 'object') {
    data = JSON.stringify(data)
  }
  global[type].setItem(`${storagePrefix}${key}`, data)
}

// 取本地数据
export function getStorage(
  key: string,
  type = 'sessionStorage',
): string | null {
  return global[type].getItem(`${storagePrefix}${key}`) || null
}

// 删除本地数据
export function deleteStorage(key: string, type = 'sessionStorage'): void {
  global[type].removeItem(`${storagePrefix}${key}`)
}

// 获取随机数
export const getRandom = (length: number): string => {
  let res = ''
  const randomMap = '0123456789abcdef'
  const randomMapLength = randomMap.length
  for (let j = 0; j < length; j++) {
    const randomNumber = Math.floor(Math.random() * (randomMapLength - 1)) + 1
    res += randomMap[randomNumber - 1]
  }
  return res
}

// 判断安卓和ios
export const getPlatform = (): string => {
  const u = navigator.userAgent
  const isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1
  const isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
  if (isAndroid) {
    return 'Android'
  } else if (isIOS) {
    return 'IOS'
  } else {
    return 'PC'
  }
}

//防抖函数
export function debounce(
  func: (...args: any) => void,
  delay = 500,
): (...args: any) => void {
  let timeout: any = null
  return function (this: any, ...args: any) {
    if (timeout) {
      clearTimeout(timeout)
      timeout = null
    }
    timeout = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

// 节流函数
export function throttle(
  func: (...args: any) => void,
  delay = 500,
): (...args: any) => void {
  let timeout: any = null
  return function (this: any, ...args: any) {
    if (timeout) {
      return
    }
    timeout = setTimeout(() => {
      func.apply(this, args)
      clearTimeout(timeout)
      timeout = null
    }, delay)
  }
}

/**
 * 获取静态资源地址
 * @param dir 目录名
 * @param name 资源名
 * @returns
 */
export const getStaticUrl = (dir: string, name: string): string => {
  const hostPath =
    process.env.VUE_APP_ENV_TYPE === 'production'
      ? `//static.kfang.com/kfang/marketing-tools/${dir}/`
      : `//test-static.kfang.com/kfang/marketing-tools/${dir}/`
  return hostPath + name
}

/**
 * 事件统计
 * 参考：https://tongji.baidu.com/web/help/article?id=236&type=0
 * @param category string 要监控的目标的类型名称
 * @param action string 用户跟网页进行交互的动作名称
 * @param opt_label string 事件的一些额外信息
 * @param opt_value number 跟事件相关的数值
 *
 * @returns void
 * */
export const statisticsEvents = (
  category: string,
  action: string,
  opt_label: string,
  opt_value: string,
): void => {
  if (global._hmt) {
    global._hmt.push(['_trackEvent', category, action, opt_label, opt_value])
  }
}

// 手机号码隐藏
export const telephoneNumberHidden = (number: string | number): string => {
  if (typeof number === 'number') {
    number = number.toString()
  }
  return number.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

const fillImage = (selectorName: string, canvas: HTMLCanvasElement) => {
  const target = document.querySelector(selectorName) as HTMLElement
  if (target) {
    // target.appendChild(canvas)

    target.style.backgroundImage = `url(${canvas.toDataURL('image/png')})`
  }
}

// 生成水印背景
export function createWaterMark(
  text: string, // 文本
  selectorName: string | string[], // 需要渲染的dom节点
  rowNumber = 2, // 一行展示多少条
  height = 80, // canvas 图片高度
  rotateAngle = -15, // 倾斜角度
  style?: {
    font?: string // 样式
    fillStyle?: string // 填充样式的字体颜色
  },
  config?: {
    offsetX?: number // x轴 begin drawing the text
    offsetY?: number // y轴 begin drawing the text
  },
): void {
  const clientWith = document.documentElement.clientWidth
  const canvas: HTMLCanvasElement = document.createElement('canvas')

  canvas.width = Math.round(clientWith / rowNumber)
  canvas.height = height
  canvas.style.display = 'none'

  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.font =
      (style && style.font) || '400 14px PingFangSC-Regular, PingFang SC'
    ctx.fillStyle = (style && style.fillStyle) || '#e6ebed'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'

    ctx.rotate((rotateAngle * Math.PI) / 180)

    // x 轴从宽度的1/3开始绘制，而y轴则是角度加上 1/2的距离
    const fillX = canvas.width / 3
    const fillY = canvas.height / 2 + Math.abs(rotateAngle)
    ctx.fillText(
      text,
      config && config.offsetX ? config.offsetX : fillX,
      config && config.offsetY ? config.offsetY : fillY,
    )
  }

  if (Array.isArray(selectorName)) {
    for (let i = 0; i < selectorName.length; i++) {
      fillImage(selectorName[i], canvas)
    }
  } else {
    fillImage(selectorName, canvas)
  }
}
