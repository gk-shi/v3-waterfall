interface V3WaterfallInnerProperty {
  _v3_styles?: Record<string, string | number | boolean>
  _v3_hidden?: boolean
  _v3_hash_id?: string
  _v3_height?: number | string
  _v3_top?: number | string
  _v3_bottom?: number | string
  [p: string]: any
}

interface V3WaterfallObject {
  _v3_waterfall?: V3WaterfallInnerProperty
}

type ActualItemOfList<T extends object> = T & V3WaterfallObject

type ActualList<T extends object> = ActualItemOfList<T>[]