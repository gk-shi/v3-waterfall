import { Ref } from 'vue'
import Emitter from '../utils/ScrollEmitter'
import { V3WaterfallInnerProperty } from '../global'

type VirtualFilter = {
  bind: (scrollEl: HTMLElement | null) => void
  unbind: () => void
  filter: () => void
}

export default function virtualFilter<T extends object>(
  list: Ref<T[]>,
  displyList: Ref<T[]>,
  isActive: Ref<boolean>,
  time: number,
  innerWeakMap: WeakMap<T, V3WaterfallInnerProperty>,
  virtualLen?: number
): VirtualFilter {
  const virtualLength = virtualLen || 500 // 前后预加载的虚拟长度
  const emitter = new Emitter()
  let scrollElement: null | HTMLElement = null

  const filter = () => {
    if (!isActive.value) return
    if (!time) {
      displyList.value = list.value
      return
    }
    const viewport = scrollElement || document.documentElement || document.body
    const vHeight = viewport.clientHeight
    /**
     * 隐藏的元素有两类：
     * 1.在视窗底部还未出现的，距离视窗 viewport 底部 virtualLength 以外的
     * 1.在视窗顶部滚动出去的，距离视窗 viewport 顶部 virtualLength 以外的
     */
    const scrollTop = viewport.scrollTop
    displyList.value = list.value.filter((l) => {
      const inner = innerWeakMap.get(l)
      // case: 当在滚动时又在加载新的未经计算的元素时
      if (!inner) return false
      const { _v3_top: v3Top, _v3_height: v3Height } = inner
      const topDisappeared = scrollTop > v3Top + v3Height + virtualLength
      const bottomDisappeared = scrollTop + vHeight + virtualLength < v3Top
      return !(topDisappeared || bottomDisappeared)
    })
  }

  const bind = (scrollEl: HTMLElement | null) => {
    // 如果触发时间为 0 ，则不进行虚拟列表操作
    if (!time) return
    scrollElement = scrollEl
    emitter.add(filter)
    emitter.bind(scrollEl, time)
  }

  const unbind = () => {
    if (!time) return
    emitter.unbind()
  }

  return {
    bind,
    unbind,
    filter
  }
}
