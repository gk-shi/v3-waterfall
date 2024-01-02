<template>
  <div>
    <!-- default slot 区域 -->
    <div :id="wrapperID" class="vue3-waterfall-wrapper" :style="{
        height: wrapperHeight + 'px',
        width: wrapperWidth + 'px',
      }">
      <div :class="['waterfall-item', itemClass]" :style="item._v3_styles || { width: actualColWidth + 'px' }"
        v-for="(item, idx) of actualList" :key="item._v3_hash_id">
        <slot v-if="!item._v3_hidden" :item="item" :raw="list[idx]"></slot>
      </div>
    </div>
    <!-- loading slot 区域 -->
    <slot v-if="actualLoading && !isOver" name="loading">
      <div class="waterfall-loading">
        <div class="dot-wrapper">
          <span class="dot" :style="'background-color:' + dotsColor" v-for="(item, idx) of new Array(dotsNum)" :key="idx"></span>
        </div>
      </div>
    </slot>
    <!-- 底部锚点区域 -->
    <div v-if="!isOver" :id="anchorID" class="bottom-anchor" :style="{ height: distanceToScroll + 'px' }"></div>
    <!-- 加载完 slot 区域 -->
    <slot v-if="isOver" name="footer">
      <div class="waterfall-over-message">呀，被看光了！</div>
    </slot>
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import { toRefs } from 'vue'
import useUniqueID from './composables/useUniqueId'
import { _v3_error_image } from './utils/errorImgBase64'

// 定义组件需要暴露的名字
defineOptions({ name: 'v3-waterfall' })

const { wrapperID, anchorID, itemClass } = useUniqueID()

const props = withDefaults(defineProps<V3WaterfallProps>(), {
  list: () => [],
  colWidth: 250,
  srcKey: 'src',
  gap: 20,
  bottomGap: 10,
  isLoading: false,
  isOver: false,
  dotsCount: 5,
  dotsColor: 'rgba(169, 169, 169, 0.8)',
  distanceToScroll: 200,
  errorImgSrc: _v3_error_image,
  scrollBodySelector: '',
  isMounted: false,
  virtualTime: 400,
  virtualLength: 500
})

const { colWidth, srcKey, gap, bottomGap, dotsCount, dotsColor, distanceToScroll, errorImgSrc, scrollBodySelector, virtualTime, virtualLength } = props
// 这几个值需要保持响应式
const { list, isLoading, isOver, isMounted } = toRefs(props)


// 定义 props 类型
export interface V3WaterfallProps {
  list: WaterfallList<T> // 元数据列表
  colWidth: number | (() => number) // 列宽
  srcKey: string | string[] // 图片地址的键值，数组支持多个键值
  gap: number | (() => number) // 两列间的间隔，单位：px
  bottomGap: number | (() => number) // 上下元素的间距，单位：px
  isLoading: boolean // 是否正在加载
  isOver: boolean // 是否结束（所有数据加载完）
  dotsCount: number // 底部加载中状态点的数量
  dotsColor: string // 底部加载中状态点的颜色
  distanceToScroll: number // 底部触发加载的距离，单位：px
  errorImgSrc: string // 图片加载失败时默认展示的替换图片
  scrollBodySelector: string // 滚动主体选择器，默认为页面
  isMounted: boolean // 父组件是否加载完成，和 scrollBodySelector 配合使用
  virtualTime: number // 虚拟列表的触发间隔, 为 0 时不做虚拟列表
  virtualLength: number // 元素隐藏时距离视窗的距离
}
</script>

<style scoped>

</style>
