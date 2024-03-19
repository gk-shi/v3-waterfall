/**
 * 提供滚动监听
 */

export default class ScrollEmitter {
  // 滚动元素 scroll element
  scrollElement: Window | HTMLElement
  // 节流延迟：用来提升性能，默认 400
  time: number
  // 执行回调
  scrollFnQueue: (() => void)[]
  // 是否在等待该次回调执行(因为是后置节流操作)
  isWaiting: boolean

  constructor() {
    this.scrollElement = window
    this.time = 400
    this.scrollFnQueue = []
    this.isWaiting = false
  }

  /**
   * @description: 绑定滚动事件监听
   * @param {null | HTMLElment} target 监听滚动目标，默认为 window(body)
   * @param {number} time 节流延迟
   * @return {*}
   */
  bind(target: null | HTMLElement, time: number | undefined) {
    this.scrollElement = target || this.scrollElement
    this.time = time || this.time
    this.scrollElement.addEventListener('scroll', this.resolve.bind(this))
  }

  /**
   * @description: 回调执行
   * @return {*}
   */
  resolve() {
    if (this.isWaiting) return
    this.isWaiting = true
    setTimeout(() => {
      this.scrollFnQueue.forEach((f) => f && f())
      this.isWaiting = false
    }, this.time)
  }

  /**
   * @description: 解绑事件
   * @return {*}
   */
  unbind() {
    this.scrollElement.addEventListener('scroll', this.resolve.bind(this))
    this.scrollFnQueue = []
  }

  /**
   * @description: 添加回调
   * @param {function} scrollFn 需要添加的回调函数
   * @return {*}
   */
  add(scrollFn: () => void) {
    this.scrollFnQueue.push(scrollFn)
  }

  /**
   * @description: 删除回调
   * @param {function} scrollFn 需要删除的回调函数
   * @return {*}
   */
  del(scrollFn: () => void) {
    const idx = this.scrollFnQueue.findIndex((f) => f === scrollFn)
    idx !== -1 && this.scrollFnQueue.splice(idx, 1)
  }
}
