import { isMobile } from '../utils'
import { ref, Ref } from 'vue'


type InitColumnsAndColWidth = {
  actualColWidth: Ref<number>
  columns: Ref<number>
  topOfEveryColumn: Ref<number[]>
  updateColumnsAndWidth: () => void
}

/**
 * @description: 计算排布多少列
 * @param {String} selector 选择器
 * @param {Ref<number>} colWidth 列宽
 * @param {Ref<number>} gap 两列的间距
 * @param {Ref<number>} mobileGap 移动端两列的间距
 * @return {InitColumnsAndColWidth}
 */
export default function initColumnsAndColWidth (
  selector: string,
  colWidth: Ref<number>,
  gap: Ref<number>,
  mobileGap: Ref<number>
): InitColumnsAndColWidth {
  const actualColWidth = ref(0)  // 实际列宽
  const columns = ref(1)  // 实际列数
  const topOfEveryColumn = ref<number[]>([])  // 记录每列下一个卡片应设置的 top 值

  // 更新列数以及实际宽度
  const updateColumnsAndWidth = (): void => {
    actualColWidth.value = colWidth.value
    columns.value = 1
    const parentWidth = document.querySelector(selector)?.parentElement?.offsetWidth || 0
    /**
     * 当为手机端，且容器宽度不足以展示两列时(包括两列宽度+一列间隔)，
     * 重新设置实际展示一列，且 列宽 = 容器宽度 - (2 * 间隔)
     */
    if (isMobile() && parentWidth < (colWidth.value * 2) + mobileGap.value) {
      actualColWidth.value = parentWidth - (2 * mobileGap.value)
      topOfEveryColumn.value = Array(columns.value).fill(0)
      return
    }
    /**
     * 当可以展示多列的情况，最极限的情况为：容器宽度 = n * 列宽 + (n - 1) * 间隔
     * 举例：如果容器宽度为 300，列宽为 140，间隔为 20，
     * 此时展示两列，中间一个间隔，2 * 140 + (2 - 1) * 20 = 300
     * 所以，等式两边同时+1个间隔，得出 实际列数(n) ≤ (容器宽度 + 间隔) / (列宽 + 间隔)
     */
    const g = isMobile() ? mobileGap.value : gap.value
    columns.value = Math.floor((parentWidth + g) / (colWidth.value + g))
    // 初始时，每一列的 top 值都为 0
    topOfEveryColumn.value = Array(columns.value).fill(0)
  }

  return {
    actualColWidth,
    columns,
    topOfEveryColumn,
    updateColumnsAndWidth
  }
}

