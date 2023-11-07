<template>
  <div>
    <div :id="wrapperId" class="vue3-waterfall-wrapper" :style="{
        height: wrapperHeight + 'px',
        width: wrapperWidth + 'px',
      }">
      <div :class="['waterfall-item', itemClass]" :style="item._v3_styles || { width: actualColWidth + 'px' }"
        v-for="(item, idx) of actualList" :key="item._v3_hash_id">
        <slot v-if="!item._v3_hidden" :item="item" :raw="list[idx]"></slot>
      </div>
    </div>
    <slot v-if="actualLoading && !isOver" name="loading">
      <div class="waterfall-loading">
        <div class="dot-wrapper">
          <span class="dot" :style="'background-color:' + dotsColor" v-for="(item, idx) of new Array(dotsNum)" :key="idx"></span>
        </div>
      </div>
    </slot>
    <div v-if="!isOver" :id="anchorId" class="bottom-anchor" :style="{ height: distanceToScroll + 'px' }"></div>
    <slot v-if="isOver" name="footer">
      <div class="waterfall-over-message">呀，被看光了！</div>
    </slot>
  </div>
</template>

<script lang="ts">
/* eslint-disable @typescript-eslint/ban-types */
import { computed, defineComponent, nextTick, onActivated, onBeforeUnmount, onDeactivated, onMounted, ref, toRefs, watch } from 'vue'
import { getDevice } from './utils'
import { calculateCols, imagePreload, layout, virtualFilter } from './composable'


export default defineComponent({
  name: 'v3-waterfall',
  props: {
    list: {
      type: Array,
      default: () => []
    },
    colWidth: { // 每列的宽度，不包括两列的间隔
      type: Number,
      default: 250
    },
    srcKey: {  // 图片地址的键值
      type: String,
      default: 'src'
    },
    gap: { // 两列间的间隔，PC 端，px
      type: Number,
      default: 20
    },
    mobileGap: { // 两列间的间隔，手机端，px
      type: Number,
      default: 8
    },
    bottomGap: { // 上下间距, px
      type: Number,
      default: 10
    },
    isLoading: {
      type: Boolean,
      default: false
    },
    isOver: {
      type: Boolean,
      default: false
    },
    dotsNum: {
      type: Number,
      default: 5
    },
    dotsColor: {
      type: String,
      default: ''
    },
    distanceToScroll: {
      type: Number,
      default: 200
    },
    scrollBodySelector: { // 滚动主体选择器，默认为页面
      type: String,
      default: ''
    },
    isMounted: { // 和 scrollBodySelector 配合使用
      type: Boolean,
      default: false
    },
    errorImgSrc: { // 图片加载失败时默认展示的图片
      type: String,
      default: ''
    },
    virtualTime: { // 虚拟列表的触发间隔, 默认为 0 时，不做虚拟列表
      type: Number,
      default: 0
    },
    virtualLength: { // 元素隐藏时距离视窗的距离
      type: Number,
      default: 500
    }
  },
  setup (props, { emit }) {
    const { colWidth, gap, mobileGap, list, isLoading, isOver, isMounted } = toRefs(props)
    // eslint-disable-next-line vue/no-setup-props-destructure
    const { srcKey, bottomGap, scrollBodySelector, errorImgSrc, virtualTime, virtualLength } = props

    // 唯一id
    const timestamp = Date.now()
    const anchorId = 'anchor' + timestamp
    const wrapperId = 'wrapper' + timestamp
    const itemClass = 'item' + timestamp

    // 是否为手机端
    let isMobile = getDevice(navigator.userAgent) === 'mobile'
    let actualGap = isMobile ? mobileGap.value : gap.value

    const {
      actualColWidth,
      actualCols,
      colsTop,
      calculateActualCols
    } = calculateCols(`#${wrapperId}`, colWidth, gap, mobileGap)


    const {
      actualList,
      setActualList,
      setLastPreloadImgIdx,
      imagePreloadHandle
    } = imagePreload()

    const {
      wrapperHeight,
      setLastLayoutImgIdx,
      layoutHandle
    } = layout(`.${itemClass}`, list, actualColWidth, actualList, actualCols, actualGap, bottomGap)


    // 容器实际宽度
    const wrapperWidth = computed(() => {
      return actualColWidth.value * actualCols.value + actualGap * (actualCols.value - 1)
    })
    // 加载状态
    const actualLoading = computed(() => {
      return isLoading.value || actualList.value.length !== list.value.length
    })

    watch(actualLoading, (newV) => {
      if (!newV) {
        setTimeout(() => {
          checkAnchorIsHidden()
        }, 100)
      }
    })

    // 进行瀑布流计算
    const waterfall = <T extends object>(itemList: T[]): void => {
      const itemListNew: T[] = JSON.parse(JSON.stringify(itemList))
      imagePreloadHandle(
        itemListNew,
        actualColWidth,
        () => layoutHandle(colsTop),
        srcKey,
        errorImgSrc
      )
    }

    // 兼容滚动事件绑定在 window 上，
    // 并且页面被 keep-alive 缓存时滚动穿越的情形
    // (a 页面绑定滚动被缓存，b 页面滚动会影响 a 页面的监听)
    const isActive = ref(true)
    onActivated(() => (isActive.value = true))
    onDeactivated(() => (isActive.value = false))


    const {
      bind,
      unbind
    } = virtualFilter(actualList, isActive, virtualTime, virtualLength)


    // 使用 IntersectionObserver
    let scrollElement: null | HTMLElement = null
    let intersectionObserver: IntersectionObserver
    function observer () {
      intersectionObserver = new IntersectionObserver((entries) => {
        // 如果 intersectionRatio 为 0，则目标在视野外，
        // 我们不需要做任何事情。
        if (entries[0].intersectionRatio <= 0) return
        if (actualLoading.value || isOver.value || !isActive.value) return
        emit('scroll-reach-bottom')
      }, {
        root: scrollElement
      })
      // 开始监听
      intersectionObserver.observe(document.getElementById(anchorId) as HTMLElement)
    }

    // 校验加载一次数据后底部锚点元素是否隐藏，没隐藏还需要再加载一次数据
    function checkAnchorIsHidden () {
      if (isOver.value) return
      const viewport = scrollElement || document.documentElement || document.body
      const anchorElement = document.getElementById(anchorId) as HTMLElement
      const anchorTop = anchorElement.getBoundingClientRect().top
      if (!scrollElement) {
        if (anchorTop <= viewport.clientHeight) {
          emit('scroll-reach-bottom')
        }
      } else {
        const viewportTop = viewport.getBoundingClientRect().top
        const viewportClientHeight = viewport.clientHeight
        if (anchorTop - viewportTop <= viewportClientHeight) {
          emit('scroll-reach-bottom')
        }
      }
    }


    // 如果滚动事件是绑定在非 window 对象上使用
    watch(isMounted, (newV: boolean) => {
      if (scrollBodySelector && newV) {
        scrollElement = document.querySelector(scrollBodySelector) as HTMLElement
        bind(scrollElement)
        observer()
      }
    })

    // 第一次加载或者重载
    const firstOrReset = <T extends object>(): void => {
      if (scrollElement && scrollBodySelector) {
        // 在存在指定父元素滚动的时候，切换或重载时需要滚动到顶部
        scrollElement.scrollTo(0, 0)
      }
      setLastPreloadImgIdx(-1)
      setLastLayoutImgIdx(-1)
      setActualList([])
      calculateActualCols(isMobile)
      waterfall(list.value as T[])
    }

    watch(list, <T extends object>(newV: unknown[], oldV: unknown[]) => {
      if (newV[0] !== oldV[0]) {
        firstOrReset()
        return
      }
      waterfall(newV as T[])
    })


    const documentBody = document.documentElement || document.body
    // resize 时的 handle
    let timeHandler: number
    let lastClientWidth = documentBody.offsetWidth
    const resizeHandle = (): void => {
      const clientWidth = documentBody.offsetWidth
      if (clientWidth === lastClientWidth) return
      lastClientWidth = clientWidth
      clearTimeout(timeHandler)
      // 重新计算
      timeHandler = setTimeout(() => {
        isMobile = getDevice(navigator.userAgent) === 'mobile'
        actualGap = isMobile ? mobileGap.value : gap.value
        firstOrReset()
      }, 500)
    }


    onMounted(() => {
      if (list.value && list.value.length > 0) {
        firstOrReset()
      }
      window.addEventListener('resize', resizeHandle)
      if (!scrollBodySelector) {
        nextTick(() => {
          bind(scrollElement)
          observer()
        })
      }
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', resizeHandle)
      unbind()
      intersectionObserver.disconnect()
    })

    const reRender = firstOrReset  // 暴露给外部的重渲染方法

    return {
      anchorId,
      wrapperId,
      itemClass,
      isMobile,
      wrapperWidth,
      wrapperHeight,
      actualLoading,
      actualColWidth,
      actualList,
      actualCols,
      reRender
    }
  }
})

</script>

<style lang="scss" scoped>
.vue3-waterfall-wrapper {
  width: 100%;
  position: relative;
  margin: 0 auto;
}

.waterfall-item {
  // visibility: hidden;
  position: absolute;
  transition: all 0.3s;
  animation: scaleItem 0.3s linear forwards;
}

.waterfall-over-message {
  height: 40px;
  line-height: 40px;
  text-align: center;
  color: #999999;
}

.dot-wrapper {
  padding: 10px 0;
  text-align: center;

  .dot {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: rgba(169, 169, 169, 0.8);
    margin: 0 2px;

    &:nth-of-type(2n) {
      animation: dotScale 0.4s linear infinite alternate;
    }

    &:nth-of-type(2n - 1) {
      animation: dotScale 0.4s linear 0.4s infinite alternate;
    }
  }
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
