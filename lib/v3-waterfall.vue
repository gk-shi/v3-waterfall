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
      <div class="waterfall-over-message">{{ overText }}</div>
    </slot>
  </div>
</template>

<script lang="ts" setup generic="T extends object">
import { toRefs } from 'vue'
import { useUniqueID, useColumnsAndTop } from './composables'
import { isNumber } from './utils'

// 定义组件需要暴露的名字
defineOptions({ name: 'v3-waterfall' })

const props = withDefaults(defineProps<V3WaterfallProps<T>>(), {
  list: () => [],
  colWidth: 250,
  srcKey: 'src',
  gap: 20,
  bottomGap: 10,
  isLoading: false,
  isOver: false,
  dotsCount: 5,
  dotsColor: 'rgba(169, 169, 169, 0.8)',
  overText: '呀，被看光了！',
  overColor: '#999999',
  distanceToScroll: 200,
  errorImgSrc: '',
  scrollBodySelector: '',
  isMounted: false,
  virtualTime: 0,
  virtualLength: 500
})

const { colWidth, srcKey, gap, bottomGap, dotsCount, dotsColor, overText, overColor, distanceToScroll, errorImgSrc, scrollBodySelector, virtualTime, virtualLength } = props
const finalGap = isNumber(gap) ? gap : gap()
const finalWidth = isNumber(colWidth) ? colWidth : colWidth()

// 这几个值需要保持响应式
const { list, isLoading, isOver, isMounted } = toRefs(props)

const { wrapperID, anchorID, itemClass } = useUniqueID()

const { columns, wrapperWidth, topOfEveryColumn, updateColumnsAndTop } = useColumnsAndTop(`${#wrapperID}`, finalWidth, finalGap)

// 每个元素与之生成的内部属性
const innerWeakMap = new WeakMap<T, V3WaterfallInnerProperty>()



</script>

<style scoped>
.vue3-waterfall-wrapper {
  width: 100%;
  position: relative;
  margin: 0 auto;
}

.waterfall-item {
  visibility: hidden;
  position: absolute;
  /* transition: all 0.3s;
  animation: scaleItem 0.3s linear forwards; */
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
