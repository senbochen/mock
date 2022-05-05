/**
 * @description 对于时间处理的方法
 */
import dayjs from 'dayjs'

type Formatter = (timestamp: Date | number | string, format?: string) => string

/**
 * 格式化后的格式如下：
 * 今天： mm:ss
 * 昨天： 昨天 mm:ss
 * 其他  MM-DD mm:ss
 */
type FormatDate = {
  type: 'TODAY' | 'YESTERDAY' | 'AGO'
  formatDate: string
}
export const formatQuickDate = (time: Date | number | string): FormatDate => {
  const date = dayjs(time)
  const nowDate = dayjs().startOf('date')
  // console.log(nowDate, '====now date ===')
  const diffHours = nowDate.diff(date, 'h')
  // console.log(diffHours, '====now diffHours ===')
  if (diffHours <= 0) {
    return {
      type: 'TODAY',
      formatDate: date.format('HH:mm'),
    }
  } else if (diffHours > 0 && diffHours <= 24) {
    return {
      type: 'YESTERDAY',
      formatDate: `昨天 ${date.format('HH:mm')}`,
    }
  } else {
    return {
      type: 'AGO',
      formatDate: date.format('MM-DD HH:mm'),
    }
  }
}

const formatter = (timestamp: Date | number | string, format?: string) =>
  dayjs(timestamp).format(format)

// 格式化日期
export const formatDate: Formatter = (
  timestamp: Date | number | string,
  format = 'YYYY-MM-DD',
) => formatter(timestamp, format)
