type WaterfallList<T = any> = T[]

type HeightHook<T = any> = null | ((item: T, width: number) => number)

// 定义 props 类型
interface V3WaterfallProps<T> {
  list: WaterfallList<T>
  colWidth: number | (() => number)
  srcKey: string | string[]
  gap: number | (() => number)
  bottomGap: number | (() => number)
  isLoading: boolean
  isOver: boolean
  dotsCount: number
  dotsColor: string
  overText: string
  overColor: string
  distanceToScroll: number
  errorImgSrc: string
  scrollBodySelector: string
  isMounted: boolean
  virtualTime: number
  virtualLength: number
  heightHook: HeightHook<T>
}

// 内部需要生成的一些属性
interface V3WaterfallInnerProperty {
  _v3_hash: string
  _v3_styles?: {
    transform: string
  }
  _v3_height?: number | string
  _v3_top?: number | string
  _v3_left?: number | string
  _v3_position?: {
    col: number
    row: number
  }
  [p: string]: any
}