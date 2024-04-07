/**
 * @description: 获取设备的型号
 * @param {string} userAgent window.userAgent
 * @return {string} mobile/ipad/pc
 */
export function getDevice(userAgent?: string): Device {
  userAgent = userAgent || window.navigator.userAgent
  return /(Android|iPhone|iPod|iOS|SymbianOS|Windows Phone)/gi.test(userAgent)
    ? 'mobile'
    : /iPad/gi.test(userAgent)
      ? 'ipad'
      : 'pc'
}


/**
 * @description: 是否为手机
 * @return {boolean}
 */
export function isMobile (): boolean {
  return getDevice() === 'mobile'
}

/**
 * @description: 判断屏幕最大宽度不超过
 * @param {number} width 要判断的最大宽度
 * @return {boolean} 屏幕宽度是否小于等于 width
 */
export function screenMaxIs(width: number): boolean {
  return window.screen.width <= width
}


/**
 * @description: 判断是否为 number 类型
 * @param {any} attr
 * @return {boolean}
 */
export function isNumber(attr: any): attr is number {
  return typeof attr === 'number'
}

/**
 * @description: 判断是否为 string 类型
 * @param {any} attr
 * @return {boolean}
 */
export function isString(attr: any): attr is string {
  return typeof attr === 'string'
}

export type Device = 'mobile' | 'ipad' | 'pc'
