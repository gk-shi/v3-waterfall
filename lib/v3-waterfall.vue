<template>
  <div>
    <!-- default slot 区域 -->
    <div :id="wrapperID" class="vue3-waterfall-wrapper" :style="{
      width: wrapperWidth + 'px',
      height: wrapperHeight + 'px'
    }">
      <div
        v-for="(item, idx) of displayList"
        :key="getItemProperty(item)._v3_hash"
        :class="['waterfall-item', itemClass]"
        :style="getItemProperty(item)._v3_styles || {}"
      >
        <slot :item="item" :position="getItemProperty(item)._v3_position"></slot>
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
import { Ref, onMounted, toRefs, ref, watch, useSlots, onActivated, onDeactivated, nextTick, onBeforeUnmount } from 'vue'
import { useUniqueID, useColumnsAndTop, useLayout, useAnchorObserver } from './composables'
import type { V3WaterfallProps, V3WaterfallInnerProperty, WaterfallList } from './global.d'

// 定义组件需要暴露的名字
defineOptions({ name: 'v3-waterfall' })

defineSlots<{
  default(props: { item: T, position: { col: number, row: number } }): any
  loading(): any
  footer(): any
}>()

const emit = defineEmits<{
  'scroll-reach-bottom': []
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
  virtual: true, // 是否开启虚拟列表
  virtualLength: 500, // 元素隐藏时距离视窗的距离
  heightHook: null // 用户自定义元素高度计算方式
})

const { colWidth, gap, bottomGap, dotsCount, dotsColor, overText, overColor, distanceToScroll, errorImgSrc, scrollBodySelector, virtual, virtualLength, heightHook } = props

// 这几个值需要保持响应式
const { list, isLoading, isOver, isMounted } = toRefs(props)

const { wrapperID, anchorID, itemClass } = useUniqueID()
const getWidthOfWrapperParent = () => {
  return document.querySelector(`#${wrapperID}`)?.parentElement?.offsetWidth || 0
}

const { finalWidth, finalGap, columns, wrapperWidth, topOfEveryColumn, updateColumnsAndTop } = useColumnsAndTop(getWidthOfWrapperParent, colWidth, gap)

// 每个元素与之生成的内部属性
const innerWeakMap = new WeakMap<T, V3WaterfallInnerProperty>()
function getItemProperty(item: T) {
  return innerWeakMap.get(item) || {} as V3WaterfallInnerProperty
}
// 列号 -> 元素列表
const colToListMap = new Map<string | number, WaterfallList<T>>()

const slots = useSlots()
const { wrapperHeight, layout } = useLayout(innerWeakMap, colToListMap, topOfEveryColumn, bottomGap, finalWidth, finalGap, errorImgSrc, slots, heightHook)

const displayList = ref<WaterfallList<T>>([]) as Ref<WaterfallList<T>>

const waterfall = async (noLayoutedList: WaterfallList<T>) => {
  await layout(noLayoutedList)
  // TODO 虚拟列表计算
  displayList.value = list.value
}

// 兼容滚动事件绑定在 window 上，
// 并且页面被 keep-alive 缓存时滚动穿越的情形
// (a 页面绑定滚动被缓存，b 页面滚动会影响 a 页面的监听)
const isActive = ref(true)
onActivated(() => (isActive.value = true))
onDeactivated(() => (isActive.value = false))


// 支持滚动事件绑定至非 window 对象
let scrollElement: null | HTMLElement = null
// 观察底部 anchor 是否出现
const { anchorObserver, anchorDisconnect, anchorIsHidden } = useAnchorObserver()
const anchorObserverHandler = () => {
  const anchor = document.getElementById(anchorID)
  anchorObserver(scrollElement, anchor, () => {
    if (isLoading.value || isOver.value || !isActive.value) return
    emit('scroll-reach-bottom')
  })
}

watch(isLoading, (newV) => {
  if (!newV) {
    setTimeout(() => {
      const viewport = scrollElement || document.documentElement || document.body
      const anchor = document.getElementById(anchorID)
      const isHidden = anchorIsHidden(scrollElement, viewport, anchor)
      if (!isHidden) {
        // emit('scroll-reach-bottom')
      }
    }, 100)
  }
})

watch(isMounted, (newV) => {
  if (scrollBodySelector && newV) {
    scrollElement = document.querySelector(scrollBodySelector)
    anchorObserverHandler()
  }
})

// 防止一种 case：当底部 anchor 最开始没有渲染，切换到渲染时， observer 初始并没有观察到 anchor
watch(isOver, (newV, oldV) => {
  if (!newV && oldV) {
    nextTick(() => {
      anchorObserverHandler()
    })
  }
})

watch(list, (newV, oldV) => {
  const start = oldV.length ? oldV.length : 0
  const noLayouted = newV.slice(start)
  waterfall(noLayouted)
})

const init = () => {
  if (scrollElement && scrollBodySelector) {
    // 在存在指定父元素滚动的时候，切换或重载时需要滚动到顶部
    scrollElement.scrollTo(0, 0)
  }
  updateColumnsAndTop()
  waterfall(list.value)
}

// resize 相关
const documentBody = document.documentElement || document.body
let resizeTimeHandler: NodeJS.Timeout
let lastClientWidth = documentBody.offsetWidth
const resizeHandelr = () => {
  const clientWidth = documentBody.offsetWidth
  if (clientWidth === lastClientWidth) return
  lastClientWidth = clientWidth
  clearTimeout(resizeTimeHandler)
  resizeTimeHandler = setTimeout(() => {
    init()
  }, 500)
}

onMounted(() => {
  init()
  window.addEventListener('resize', resizeHandelr)
  if (!scrollBodySelector) {
    nextTick(() => {
      anchorObserverHandler()
    })
  }
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeHandelr)
  anchorDisconnect()
})
</script>

<style scoped>
.vue3-waterfall-wrapper {
  width: 100%;
  position: relative;
  margin: 0 auto;
}

.waterfall-item {
  /* visibility: hidden; */
  position: absolute;
  transition: all 0.3s;
  animation: scaleItem 0.3s linear forwards;
}

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
