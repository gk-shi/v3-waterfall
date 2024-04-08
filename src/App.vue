<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue'
import { getData } from './mock'
import type { V3WaterfallExpose } from 'lib/global'

const list = ref<unknown[]>([])

const loading = ref(false)
const over = ref(false)
const fetchList = async (): Promise<void> => {
  loading.value = true
  const newList = await getData()
  loading.value = false

  list.value = list.value.concat(newList)
  if (list.value.length > 30) over.value = true
}

onMounted(fetchList)

let isLoad = false
const getNext: () => Promise<void> = async (): Promise<void> => {
  if (isLoad) return
  isLoad = true
  await fetchList()
  isLoad = false
}

const isMounted = ref(false)

const forUpdate = ref(0)
const isLimit = ref(false)
const toggleLimit = () => {
  isLimit.value = !isLimit.value
  isMounted.value = false
  list.value = []
  over.value = false
  forUpdate.value++
  nextTick(async () => {
    await fetchList()
    isMounted.value = true
  })
}

const v3WaterfallRef = ref<V3WaterfallExpose | null>()
const insertBefore = async () => {
  const data = await getData()
  data.forEach((item, idx) => item.title += `-插入${idx + 1}`)
  v3WaterfallRef.value?.insertBefore(data)
}
</script>

<template>
  <div class="menu">
    <p :class="{ active: !isLimit }" @click="toggleLimit">滚动挂载 window</p>
    <p :class="{ active: isLimit }" @click="toggleLimit">滚动挂载父元素</p>
    <p @click="insertBefore">在最前面插入元素</p>
  </div>
  <div :class="{ content: true, 'limit-box': isLimit }">
    <v3-waterfall
      ref="v3WaterfallRef"
      :key="forUpdate"
      :list="list"
      :colWidth="280"
      :virtual-time="400"
      :scrollBodySelector="isLimit ? '.limit-box' : ''"
      :isMounted="isMounted"
      :isLoading="loading"
      :isOver="over"
      class="waterfall"
      @scrollReachBottom="getNext"
    >
      <template v-slot:default="slotProp">
        <div class="list-item">
          <a :href="'https://gkshi.com/blog/' + slotProp.item._id">
            <div class="cover-wrapper">
              <!-- data-key 是该图片的字段名称，目前只支持在一级的字段，不支持嵌套 -->
              <img v-if="slotProp.item.cover" :src="slotProp.item.cover" data-key="cover" class="cover" />
            </div>
            <div class="brief">
              <h3>{{ slotProp.item.title }}</h3>
              <p>{{ slotProp.item.outline }}</p>
            </div>
            <div class="cover-wrapper">
              <img :src="slotProp.item.notExistSrc" data-key="notExistSrc" class="cover" />
            </div>
          </a>
          <div class="outline-bottom">
            <p class="article-tags">
              <span>tags</span>
              <span v-for="tag of slotProp.item.tags" :key="tag" class="tag">{{
                tag
              }}</span>
            </p>
            <time>{{ slotProp.item.time }}</time>
          </div>
        </div>
      </template>
    </v3-waterfall>
  </div>
</template>

<style lang="scss" scoped>
.menu {
  position: fixed;
  left: 0;
  padding-top: 300px;
  width: 200px;
  height: 100vh;
  border-right: 1px solid #ccc;

  p {
    margin: 20px;
    cursor: pointer;
  }
}

.active {
  color: #20c180;
}

.content {
  padding-top: 30px;
  margin-left: 210px;
  background-color: #dee3e7;
}

.limit-box {
  height: 300px;
  overflow-y: scroll;
}

.waterfall,
.tags {
  width: 80%;
  margin: 0 auto;
  min-width: 1200px;
}

.tags-wrapper {
  padding: 10px 0;
  background-color: #fff;
  border-bottom: 1px solid #c4cdd4;
  margin-bottom: 15px;

  .tags {
    .tag {
      display: inline-block;
      width: 100px;
      font-size: 14px;
      color: #576575;
      padding: 5px 0;
      text-align: center;
      border: 1px solid #e8eaee;
      border-radius: 4px;
      margin: 0 10px 8px 0;

      &:hover {
        border-color: #8599ad;
      }

      &:not(.active) {
        cursor: pointer;
      }

      &.active {
        color: #ffffff;
        background-color: #576575;
        border-color: #576575;
      }
    }
  }
}

.brief {
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;

  h3,
  > p {
    word-wrap: break-word;
    word-break: break-all;
  }

  h3 {
    text-align: center;
    padding: 20px 20px 12px;
    font-weight: 400;
    color: #22252a;
  }
  > p {
    padding: 0 20px 12px;
    color: #8a98a8;
    font-size: 13px;
  }
}

.outline-bottom {
  border-top: 1px solid #e7ebef;
  background-color: #f9fafb;
  padding: 10px;
  display: flex;
  justify-content: space-between;

  .article-tags,
  time {
    font-size: 12px;
    color: #73828c;
  }

  .article-tags {
    span {
      margin-right: 6px;

      &.tag:hover {
        text-decoration: underline;
        color: #000000;
        cursor: pointer;
      }
    }
  }
}

.list-item {
  box-sizing: border-box;

  .cover-wrapper {
    overflow: hidden;
    background-color: #fff;
  }

  &:hover {
    box-shadow: 5px 5px 5px #ccc;

    .cover {
      animation: scaleImg 0.1s linear forwards;
    }

    @keyframes scaleImg {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(1.5);
      }
    }
  }
}

.cover {
  width: 100%;
  vertical-align: middle;
}

/* ipad pro */
@media screen and (max-width: 1024px) {
  header {
    height: 40vh;
    background-size: 100% 100%;
  }
}

@media screen and (max-width: 1000px) {
  .waterfall,
  .tags {
    width: 100%;
    padding: 0 30px;
    box-sizing: border-box;
    min-width: auto;
  }
}

@media screen and (max-width: 576px) {
  header {
    height: 30vh;
    min-height: 300px;

    background-size: 150% 100%;
    background-position: 40% 0;
  }

  .waterfall,
  .tags {
    width: 100%;
    padding: 0;
    box-sizing: border-box;
    min-width: auto;
  }

  .tags {
    width: 90%;
  }
}
</style>
