import { Ref, ref } from 'vue'


type Layout = {
  wrapperHeight: Ref<number>;
  setLastLayoutImgIdx: (idx: number) => void;
  layoutHandle: (colsTop: Ref<Array<number>>) => void;
}

/**
 * @description: 排版
 * @param {Ref<unknown[]>} list 原始列表
 * @param {Ref<number>} actualColWidth 实际列宽
 * @param {Ref<unknown[]>} actualList 添加排版数据后的列表
 * @param {Ref<number>} actualCols 实际列数
 * @param {number} actualGap 实际间隔
 * @param {number} bottomGap 底部距离
 * @return {Layout}
 */
export default function layout (list: Ref<unknown[]>, actualColWidth: Ref<number>, actualList: Ref<Record<string, any>[]>, actualCols: Ref<number>, actualGap: number, bottomGap: number): Layout {
  let lastLayoutImgIdx = -1  // 上一次排版最后排的元素下标

  const setLastLayoutImgIdx = (idx: number): void => {
    lastLayoutImgIdx = idx
  }


  const wrapperHeight = ref(0)
  // 布局-调整位置
  const layoutHandle = (colsTop: Ref<Array<number>>): void => {
    const waterfallItems = document.querySelectorAll('.waterfall-item') as NodeListOf<HTMLElement>
    if (waterfallItems.length === 0) return
    // 只对新的未排版的元素进行排版，优化性能
    let idx = lastLayoutImgIdx + 1
    for (; idx < list.value.length; idx++) {
      const eleHeight = waterfallItems[idx].offsetHeight
      const imgHeight = waterfallItems[idx].querySelector('img')?.offsetHeight || 0
      // 找到现有列最小高度
      const minHeight = Math.min.apply(null, colsTop.value)
      // 最小高度的列
      const minOfColIdx = colsTop.value.indexOf(minHeight)
      // 设置决定定位位置
      const left = actualColWidth.value * minOfColIdx + (minOfColIdx - 1 < 0 ? 0 : minOfColIdx - 1) * actualGap + 'px'
      const top = minHeight + 'px'
      colsTop.value[minOfColIdx] = colsTop.value[minOfColIdx] + eleHeight - imgHeight + actualList.value[idx]._height + bottomGap
      const marginLeft = actualCols.value !== 1 && minOfColIdx !== 0 ? actualGap + 'px' : '0'
      // 一次修改，减少重排
      actualList.value[idx].styles = {
        width: actualColWidth.value + 'px',
        left,
        top,
        marginLeft,
        visibility: 'visible'
      }
    }
    wrapperHeight.value = Math.max.apply(null, colsTop.value)
    lastLayoutImgIdx = waterfallItems.length - 1
  }

  return {
    wrapperHeight,
    setLastLayoutImgIdx,
    layoutHandle
  }
}
