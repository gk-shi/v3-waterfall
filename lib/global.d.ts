// interface V3WaterfallInnerProperty {
//   _v3_styles?: Record<string, string | number | boolean>
//   _v3_hidden?: boolean
//   _v3_hash_id?: string
//   _v3_height?: number | string
//   _v3_top?: number | string
//   _v3_bottom?: number | string
//   [p: string]: any
// }

// interface V3WaterfallObject {
//   _v3_waterfall?: V3WaterfallInnerProperty
// }

// type ActualItemOfList<T extends object> = T & V3WaterfallObject

// type ActualList<T extends object> = ActualItemOfList<T>[]

type WaterfallList<T = any> = T[]

// 定义 props 类型
interface V3WaterfallProps<T> {
  list: WaterfallList<T> // 元数据列表
  colWidth: number | (() => number) // 列宽
  srcKey: string | string[] // 图片地址的键值，数组支持多个键值
  gap: number | (() => number) // 两列间的间隔，单位：px
  bottomGap: number | (() => number) // 上下元素的间距，单位：px
  isLoading: boolean // 是否正在加载
  isOver: boolean // 是否结束（所有数据加载完）
  dotsCount: number // 底部加载中状态点的数量
  dotsColor: string // 底部加载中状态点的颜色
  overText: string // 加载完的文字
  overColor: string // 加载完的文字的颜色
  distanceToScroll: number // 底部触发加载的距离，单位：px
  errorImgSrc: string // 图片加载失败时默认展示的替换图片
  scrollBodySelector: string // 滚动主体选择器，默认为页面
  isMounted: boolean // 父组件是否加载完成，和 scrollBodySelector 配合使用
  virtualTime: number // 虚拟列表的触发间隔, 为 0 时不做虚拟列表
  virtualLength: number // 元素隐藏时距离视窗的距离
}

// 内部需要生成的一些属性
interface V3WaterfallInnerProperty {
  _v3_styles?: Record<string, string | number | boolean>
  _v3_hidden?: boolean
  _v3_hash_id?: string
  _v3_height?: number | string
  _v3_top?: number | string
  _v3_bottom?: number | string
  [p: string]: any
}