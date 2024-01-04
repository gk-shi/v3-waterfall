import { Ref, h, ref, render, useSlots } from "vue"
import { isNumber } from "../utils"


/**
 * @description: 进行分列布局计算
 * @param {WeakMap} innerWeakMap 元素 -> 内部属性 映射
 * @param {Map} colToListMap 列号 -> 元素列表 映射
 * @param {Ref<number[]>} topOfEveryColumn 每一列下个元素的 top 值
 * @param {number | () => number} bottomGap 底部间隔（计算函数）
 * @param {number} width 元素宽度
 * @param {number} gap 列的间隔
 * @param {HeightHook} heightHook 元素高度计算钩子
 * @return {Layout} { wrapperHeight, layout }
 */
export default function useLayout<T extends object>(
  innerWeakMap: WeakMap<T, V3WaterfallInnerProperty>,
  colToListMap: Map<string | number, WaterfallList<T>>,
  topOfEveryColumn: Ref<number[]>,
  bottomGap: number | (() => number),
  width: Ref<number>,
  gap: Ref<number>,
  heightHook: HeightHook<T>
): Layout<T> {

  const wrapperHeight = ref(0)

  const getHeight = heightHook ? heightHook : innerGetHeight

  const layout = (noLayoutedList: WaterfallList<T>, callback?: () => void) => {
    if (!noLayoutedList.length) return
    const finalBottomGap = isNumber(bottomGap) ? bottomGap : bottomGap()
    noLayoutedList.forEach((item: T) => {
      const height = getHeight(item, width.value)

      const list = topOfEveryColumn.value
      const indexOfMinTop = list.indexOf(Math.min.apply(null, list))
      const topOfThisItem = list[indexOfMinTop]
      list[indexOfMinTop] = topOfThisItem + height + finalBottomGap

      const left = (width.value + gap.value) * indexOfMinTop

      wrapperHeight.value = Math.max.apply(null, list)

      if (!colToListMap.has(indexOfMinTop)) {
        colToListMap.set(indexOfMinTop, [])
      }
      const colList = colToListMap.get(indexOfMinTop)
      colList.push(item)

      // 存储相关内部数据
      const innerObj = {
        _v3_hash: hash(),
        _v3_styles: {
          transform: `translate(${left}px, ${topOfThisItem}px)`
        },
        _v3_height: height,
        _v3_top: topOfThisItem,
        _v3_left: left,
        _v3_position: {
          col: indexOfMinTop, // 第几列，从 0 开始计数
          row: colList.length - 1
        }
      }

      innerWeakMap.set(item, innerObj)
    })

    callback && callback()
  }

  return {
    wrapperHeight,
    layout
  }

}

function innerGetHeight<T>(item: T, width: number): number {
  const slots = useSlots()
  const div = document.createElement('div')
  div.style.width = width + 'px'
  div.style.visibility = 'hidden'

  render(h(slots.default, { item, index: { col: 1, row: 1 } }), div)

  const body = document.body || document.documentElement
  body.appendChild(div)
  const height = div.clientHeight
  body.removeChild(div)
  return height
}


function hash(): string {
  return `${Date.now()}-${Math.random()}`
}


type Layout<T> = {
  wrapperHeight: Ref<number>
  layout: (list: T[], callback?: () => void) => void
}
