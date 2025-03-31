import { useSlots } from 'vue'

export type WaterfallList<T = any> = T[]
export type HeightHook<T, U = any> = null | ((slots: T, item: U, width: number, errorImgSrc: string) => Promise<number>)

// 定义 props 类型
export interface V3WaterfallProps<T> {
  list?: WaterfallList<T>
  colWidth?: number | (() => number)
  gap?: number | (() => number)
  bottomGap?: number | (() => number)
  isLoading?: boolean
  isOver?: boolean
  active?: boolean
  swipeableDelay?: number
  dotsCount?: number
  dotsColor?: string
  overText?: string
  overColor?: string
  animation?: boolean
  distanceToScroll?: number
  errorImgSrc?: string
  scrollBodySelector?: string
  isMounted?: boolean
  virtualTime?: number
  virtualLength?: number
  heightHook?: HeightHook<ReturnType<typeof useSlots>, T>
  resizeFlag?: boolean
}

// 内部需要生成的一些属性
export interface V3WaterfallInnerProperty {
  _v3_hash: string
  _v3_width?: number
  _v3_height?: number
  _v3_top?: number
  _v3_left?: number
  _v3_position?: {
    col: number
    row: number
  }
  [p: string]: any
}

export interface V3WaterfallExpose<T = any> {
  reRender: () => void
  insertBefore: (insertList: WaterfallList<T>) => Promise<void>
}
