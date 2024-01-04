<template>
  <div>
    <!-- default slot 区域 -->
    <div :id="wrapperID" class="vue3-waterfall-wrapper" :style="{
      width: wrapperWidth + 'px',
      height: wrapperHeight + 'px'
    }">
      <div
        v-for="(item, idx) of displayList"
        :key="innerWeakMap.get(item)._v3_hash"
        :class="['waterfall-item', itemClass]"
        :style="innerWeakMap.get(item)._v3_styles || { width: finalWidth + 'px' }"
      >
        <slot :item="item" :position="innerWeakMap.get(item)._v3_position"></slot>
      </div>
    </div>
    <!-- loading slot 区域 -->
    <slot v-if="isLoading && !isOver" name="loading">
      <div class="waterfall-loading">
        <div class="dot-wrapper">
          <span class="dot" v-for="(item, idx) of new Array(dotsCount)" :key="idx"></span>
        </div>
      </div>
    </slot>
    <!-- 底部锚点区域 -->
    <div v-if="!isOver" :id="anchorID" class="bottom-anchor"></div>
    <!-- 加载完 slot 区域 -->
    <slot v-if="isOver" name="footer">
      <div class="waterfall-over-message">{{ overText }}</div>
    </slot>
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import { Ref, onMounted, toRefs, ref } from 'vue'
import { useUniqueID, useColumnsAndTop, useImagesPreload, useLayout } from './composables'

// 定义组件需要暴露的名字
defineOptions({ name: 'v3-waterfall' })

defineSlots<{
  default(props: { item: T, position: { col: number, row: number } }): any
  loading(): any
  footer(): any
}>()

const props = withDefaults(defineProps<V3WaterfallProps<T>>(), {
  list: () => [], // 元数据列表
  colWidth: 250, // 列宽
  srcKey: 'src', // 图片地址的键值，数组支持多个键值
  gap: 20, // 两列间的间隔，单位：px
  bottomGap: 10, // 上下元素的间距，单位：px
  isLoading: false, // 是否正在加载
  isOver: false, // 是否结束（所有数据加载完）
  dotsCount: 5, // 底部加载中状态点的数量
  dotsColor: 'rgba(169, 169, 169, 0.8)', // 底部加载中状态点的颜色
  overText: '呀，被看光了！', // 加载完的文字
  overColor: '#999999', // 加载完的文字的颜色
  distanceToScroll: 200, // 底部触发加载的距离，单位：px
  errorImgSrc: '', // 图片加载失败时默认展示的替换图片
  scrollBodySelector: '', // 滚动主体选择器，默认为页面
  isMounted: false, // 父组件是否加载完成，和 scrollBodySelector 配合使用
  virtualTime: 0, // 虚拟列表的触发间隔, 为 0 时不做虚拟列表
  virtualLength: 500, // 元素隐藏时距离视窗的距离
  heightHook: null // 用户自定义元素高度计算方式
})

const { colWidth, srcKey, gap, bottomGap, dotsCount, dotsColor, overText, overColor, distanceToScroll, errorImgSrc, scrollBodySelector, virtualTime, virtualLength, heightHook } = props

// 这几个值需要保持响应式
const { list, isLoading, isOver, isMounted } = toRefs(props)

const { wrapperID, anchorID, itemClass } = useUniqueID()

const { finalWidth, finalGap, columns, wrapperWidth, topOfEveryColumn, updateColumnsAndTop } = useColumnsAndTop(`${#wrapperID}`, colWidth, gap)

// 每个元素与之生成的内部属性
const innerWeakMap = new WeakMap<T, V3WaterfallInnerProperty>()
// 列号 -> 元素列表
const colToListMap = new Map<string | number, WaterfallList<T>>()

const { wrapperHeight, layout } = useLayout(innerWeakMap, colToListMap, topOfEveryColumn, bottomGap, finalWidth, finalGap, heightHook)

const displayList = ref<WaterfallList<T>>([]) as Ref<WaterfallList<T>>

const preloadedHook = (preloadedList: WaterfallList<T>) => {
  layout(preloadedList, () => {
    // TODO 虚拟列表计算
    displayList.value = list.value
  })
}

const waterfall = (noLayoutedList: WaterfallList<T>) => {
  useImagesPreload(noLayoutedList, srcKey, errorImgSrc, preloadedHook)
}

const init = () => {
  updateColumnsAndTop()
  waterfall(list.value)
}

onMounted(() => {
  init()
})

</script>

<style scoped>
.vue3-waterfall-wrapper {
  width: 100%;
  position: relative;
  margin: 0 auto;
}

/* .waterfall-item {
  visibility: hidden;
  position: absolute;
  transition: all 0.3s;
  animation: scaleItem 0.3s linear forwards;
} */

.bottom-anchor {
  height: calc(v-bind(distanceToScroll) * 1px);
}

.waterfall-over-message {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: v-bind(overColor);
}

.dot-wrapper {
  padding: 10px 0;
  text-align: center;
}

.dot-wrapper > .dot {
  display: inline-block;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: v-bind(dotsColor);
  margin: 0 2px;
  }

.dot-wrapper > .dot:nth-of-type(2n) {
  animation: dotScale 0.4s linear infinite alternate;
}

.dot-wrapper > .dot:nth-of-type(2n - 1) {
  animation: dotScale 0.4s linear 0.4s infinite alternate;
}

@keyframes dotScale {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0.5);
  }
}

@keyframes scaleItem {
  0% {
    transform: scale(0.5);
  }
  100% {
    transform: scale(1);
  }
}
</style>
