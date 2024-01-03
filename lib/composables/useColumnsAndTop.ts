import { Ref, computed, ref } from 'vue'
import { isNumber } from '../utils'




/**
 * @description: 计算列数及每列的 top 值
 * @param {string} selector 父元素选择器
 * @param {number | () => number} colWidth 列宽
 * @param {number | () => number} gap 间隔
 * @return {ColumnsAndTop} { columns, wrapperWidth, topOfEveryColumn, updateColumnsAndTop }
 */
export default function useColumnsAndTop (
  selector: string,
  colWidth: number | (() => number),
  gap: number | (() => number)
): ColumnsAndTop {
  const columns = ref(1)  // 实际列数
  let topOfEveryColumn: number[] = []  // 记录每列下一个卡片应设置的 top 值

  const wrapperWidth = ref(0) // 容器实际宽度

  // 更新列数以及实际宽度
  const updateColumnsAndTop = (): void => {
    columns.value = 1
    const parentWidth = document.querySelector(selector)?.parentElement?.offsetWidth || 0

    const finalGap = isNumber(gap) ? gap : gap()
    const finalWidth = isNumber(colWidth) ? colWidth : colWidth()

    /**
     * 当可以展示多列的情况，最极限的情况为：容器宽度 = n * 列宽 + (n - 1) * 间隔
     * 举例：如果容器宽度为 300，列宽为 140，间隔为 20，
     * 此时展示两列，中间一个间隔，2 * 140 + (2 - 1) * 20 = 300
     * 所以，等式两边同时+1个间隔，得出 实际列数(n) ≤ (容器宽度 + 间隔) / (列宽 + 间隔)
     */
    columns.value = Math.floor((parentWidth + finalGap) / (finalWidth + finalGap))

    wrapperWidth.value = finalWidth * columns.value + finalGap * (columns.value - 1)

    // 初始时，每一列的 top 值都为 0
    topOfEveryColumn = Array(columns.value).fill(0)
  }

  return {
    columns,
    wrapperWidth,
    topOfEveryColumn,
    updateColumnsAndTop
  }
}


type ColumnsAndTop = {
  columns: Ref<number>
  wrapperWidth: Ref<number>
  topOfEveryColumn: number[]
  updateColumnsAndTop: () => void
}