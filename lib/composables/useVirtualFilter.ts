import { Ref } from 'vue'
import Emitter from '../utils/ScrollEmitter'
import { V3WaterfallInnerProperty, WaterfallList } from '../global'

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
     * 2.在视窗顶部滚动出去的，距离视窗 viewport 顶部 virtualLength 以外的
     */
    const scrollTop = viewport.scrollTop
    // TODO：不需要循环所有，只需要分别找到顶部、底部第一个不需要展示的，在它之前或之后的元素肯定不展示，后续优化
    displyList.value = binarySearchDisplay<T>(list.value, innerWeakMap, scrollTop, vHeight, virtualLength)
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

// TODO: 暂时没性能提升
function binarySearchDisplay<T extends object>(
  list: WaterfallList<T>,
  innerWeakMap: WeakMap<T, V3WaterfallInnerProperty>,
  scrollTop: number,
  vHeight: number,
  virtualLength: number
): WaterfallList<T> {
  if (!list.length) return []
  let start = 0
  let end = list.length - 1
  let firstTarget = -1
  while (start <= end) {
    const mid = Math.floor((start + end) / 2)
    const inner = innerWeakMap.get(list[mid])
    if (!inner) {
      // case: 当在滚动时又在加载新的未经计算的元素时，头部插入时已经经过计算，所以出现这种情况只有可能是尾部加载
      end = mid - 1
    } else {
      const { _v3_top: v3Top, _v3_height: v3Height } = inner
      const topDisappeared = scrollTop > v3Top + v3Height + virtualLength
      const bottomDisappeared = scrollTop + vHeight + virtualLength < v3Top
      if (!topDisappeared && !bottomDisappeared) {
        firstTarget = mid
        break
      } else if (topDisappeared) {
        start = mid + 1
      } else {
        end = mid - 1
      }
    }
  }
  if (firstTarget === -1) return []
  // 用找到的第一个在显示区间的元素，前后查找
  // TODO 未完成
  let leftIdx = -1
  let rightIdx = -1
  for (let i = 1; ; i++) {
    if (leftIdx !== -1 && rightIdx !== -1) break
    if (leftIdx === -1) {
      const left = list[firstTarget - i]
      const leftProerty = innerWeakMap.get(left)
      if (!left || !leftProerty) {
        leftIdx = firstTarget - i + 1
      } else {
        const { _v3_top: v3Top, _v3_height: v3Height } = leftProerty
        const topDisappeared = scrollTop > v3Top + v3Height + virtualLength
        if (topDisappeared) {
          leftIdx = firstTarget - i + 1
        }
      }
    }
    if (rightIdx === -1) {
      const right = list[firstTarget + i]
      const rightProerty = innerWeakMap.get(right)
      if (!right || !rightProerty) {
        rightIdx = firstTarget + i - 1
      } else {
        const { _v3_top: v3Top } = rightProerty
        const bottomDisappeared = scrollTop + vHeight + virtualLength < v3Top
        if (bottomDisappeared) {
          rightIdx = firstTarget + i - 1
        }
      }
    }
  }
  return list.slice(leftIdx, rightIdx + 1)
}