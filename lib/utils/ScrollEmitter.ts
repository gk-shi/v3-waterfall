/**
 * 提供滚动监听及虚拟列表展示项过滤
 */

export default class ScrollEmitter {
  // 滚动元素
  scrollElement: Window | HTMLElement
  // 节流延迟：用来提升性能，默认 400
  time: number
  // 执行回调
  scrollFnQueue: (() => void)[]
  // 是否在等待该次回调执行(因为是后置节流操作)
  isWaiting: boolean

  constructor () {
    this.scrollElement = window
    this.time = 400
    this.scrollFnQueue = []
    this.isWaiting = false
  }

  // 绑定滚动事件监听
  bind (target: null | HTMLElement, time: number | undefined): void {
    this.scrollElement = target || this.scrollElement
    this.time = time || this.time
    this.scrollElement.addEventListener('scroll', this.resolve.bind(this))
  }

  resolve (): void {
    if (this.isWaiting) return
    this.isWaiting = true
    setTimeout(() => {
      this.scrollFnQueue.forEach(f => f && f())
      this.isWaiting = false
    }, this.time)
  }

  // 解绑事件
  unbind (): void {
    this.scrollElement.addEventListener('scroll', this.resolve.bind(this))
    this.scrollFnQueue = []
  }

  // 添加回调
  add (scrollFn: () => void): void {
    this.scrollFnQueue.push(scrollFn)
  }

  // 删除回调
  del (scrollFn: () => void): void {
    const idx = this.scrollFnQueue.findIndex(f => f === scrollFn)
    idx !== -1 && this.scrollFnQueue.splice(idx, 1)
  }
}

