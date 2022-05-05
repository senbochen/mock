export const isNull = (value: unknown): boolean => {
  if (value === null || typeof value === 'undefined') {
    return true
  } else {
    return false
  }
}

export function validateType(target: unknown, type: string): any {
  return Object.prototype.toString.call(target) === `[object ${type}]`
}
