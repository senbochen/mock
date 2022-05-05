export function toFixed(number: number, precision: number): number {
  const multiplier = Math.pow(10, precision + 1),
    wholeNumber = Math.floor(number * multiplier)
  return (Math.round(wholeNumber / 10) * 10) / multiplier
}

export function createPxReplace(
  viewportWidth: number,
  minPixelValue: number,
  unitPrecision: number,
  viewportUnit: string,
): (m: string, n: string) => string {
  return function ($0: string, $1: string) {
    if (!$1) return $0
    const pixels = parseFloat($1)
    if (pixels <= minPixelValue) return $0
    return toFixed((pixels / viewportWidth) * 100, unitPrecision) + viewportUnit
  }
}
