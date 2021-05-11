/**
 * 获取是移动端还是 PC 端
 * @param userAgent
 */
export function getDevice (userAgent: string): string {
  return /(Android|iPhone|iPod|iOS|SymbianOS|Windows Phone)/ig.test(userAgent) ? 'mobile' : /iPad/ig.test(userAgent) ? 'ipad' : 'pc'
}

/**
 * 判断屏幕最大宽度不超过
 * @param width 允许最大屏幕宽度, default: 576
 */
export function screenMaxIs (width = 576): boolean {
  return window.screen.width <= width
}

