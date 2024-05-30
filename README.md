## v3-waterfall 自适应瀑布流组件

一个 vue 3 的自适应瀑布流组件。

&nbsp;

<p align="center">
  <a href="https://npmjs.com/package/v3-waterfall"><img src="https://img.shields.io/npm/v/v3-waterfall.svg" alt="npm package"></a>
  <a href="https://img.shields.io/npm/dt/v3-waterfall"><img src="https://img.shields.io/npm/dt/v3-waterfall.svg" alt="downloads"></a>
  <a href="https://img.shields.io/npm/l/v3-waterfall"><img src="https://img.shields.io/npm/l/v3-waterfall.svg" alt="downloads"></a>
</p>

文档: 中文 | [English](/README_EN.md)

[在线Demo](https://gk-shi.github.io/v3-waterfall/)

该 demo 即为本项目`src/`内容。

个人博客使用地址：[这里](https://gkshi.com/blog)

> 2.x 存在不兼容 1.x 更新，迁移方式参考文档最后说明。如需要查看 1.x 版本的文档，请查看`docs/`目录下的[v1-README.md](/docs/v1-README.md)，原则上 1.x 版本不再进行更新。

&nbsp;

### 1.支持功能

- 一个针对 vue 3 的瀑布流组件
- 支持无图模式及图片加载失败时默认图片
- 图片预加载自动计算排版，不需要指定图片宽高（**2.x 已支持多图模式、自定义提供元素高度**）
- 响应式排版
- 支持绑定滚动父元素
- 支持虚拟列表
- 支持头部插入元素（**2.x 支持，满足类似下拉加载场景**）

&nbsp;

### 2.使用方法

#### 2.1 安装

```shell
pnpm add v3-waterfall
```

#### 2.2 注册组件

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/dist/style.css'

createApp(App).use(V3waterfall).mount('#app')
```

#### 2.3 引入使用

```vue
<v3-waterfall
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
          <!-- 此处注意：data-key 是该图片的字段名称，目前只支持在一级的字段，不支持嵌套 -->
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
```

> 注意⚠️：
>
> 1.尽管做了需要多次加载的校验，但首次加载的数据尽量达到可以出现滚动的条件
>
> 2.在对 list 进行增量时，请使用`list.value = list.value.concat(addedList)`,因为组件内部会做增量加载，如果用`push`的方法添加，会造成多次触发，因此监听时取消了对`push`的响应
>
> 3.注意上面代码中的`img`标签使用，插槽中所有未在固定高度的容器中的图片(即会影响元素高度的图片)，均需要加上`data-key`字段，要求见上面的注释。(如果你提供元素高度计算方法可忽略)

基本示例在`src/App.vue`中有具体代码，同时本项目`pnpm dev`运行起来的项目即能看到效果。

&nbsp;

### 3.组件参数说明

|        参数        |                             类型                             |          默认值          | 是否必填 |                             描述                             |
| :----------------: | :----------------------------------------------------------: | :----------------------: | :------: | :----------------------------------------------------------: |
|        list        |                            array                             |            []            |    是    |                        瀑布流列表数据                        |
|      colWidth      |                    number \| () => number                    |           250            |    否    | 瀑布流卡片宽度，**现在不同屏宽使用不同宽度需要自己写函数返回对应宽度** |
|        gap         |                    number \| () => number                    |            20            |    否    |                    两列间的间距，单位：px                    |
|     bottomGap      |                    number \| () => number                    |            10            |    否    |                   上下卡片的间距，单位：px                   |
|     isLoading      |                           boolean                            |          false           |    是    |                控制请求数据时显示加载状态提示                |
|       isOver       |                           boolean                            |          false           |    是    |       控制数据是否已经全部加载完成(即不需要再滚动加载)       |
|       active       |                           boolean                            |           true           |    否    | *类似`van-tabs`组件使用多个`v3-waterfall`时确认是否激活当前实例*，[示例](https://codesandbox.io/p/devbox/v3-waterfall-van-tabs-24h8f5?file=%2Fsrc%2FApp.vue%3A69%2C33) |
|   swipeableDelay   |                            number                            |            0             |    否    | *类似`van-tabs`的`swipeable`属性开启后，可能在刚渲染时立即滑动到另一栏无法成功加载，需要设置此值，推荐为300，根据实际情况调整*,[示例](https://codesandbox.io/p/devbox/v3-waterfall-van-tabs-24h8f5?file=%2Fsrc%2FApp.vue%3A69%2C33) |
|     dotsCount      |                            number                            |            5             |    否    |                      加载中显示点的数量                      |
|     dotsColor      |                            string                            | rgba(169, 169, 169, 0.8) |    否    |                      加载中显示点的颜色                      |
|      overText      |                            string                            |      呀，被看光了！      |    否    |                         加载完的文字                         |
|     overColor      |                            string                            |         \#999999         |    否    |                      加载完的文字的颜色                      |
|     animation      |                           boolean                            |           true           |    否    |                       是否开启内置动画                       |
|    errorImgSrc     |                            string                            |            -             |    否    |           图片加载失败时展示的图片地址，有内置图片           |
|  distanceToScroll  |                            number                            |           200            |    否    |                 底部触发加载的距离，单位：px                 |
| scrollBodySelector |                            string                            |            -             |    否    | 绑定滚动父元素选择器，默认为`window`对象，与`isMounted`参数配合使用 |
|     isMounted      |                           boolean                            |          false           |    否    |     父组件是否挂载完成，配合`scrollBodySelector`参数使用     |
|    virtualTime     |                            number                            |            0             |    否    |        触发虚拟列表校验时间间隔，0 默认不开启虚拟列表        |
|   virtualLength    |                            number                            |           500            |    否    |            默认移出视窗距离开启虚拟隐藏，单位: px            |
|     heightHook     | null \| (slots, item, width, errorImgSrc) => Promise\<number> |            -             |    否    |    自定义元素块高度函数钩子，支持promise，此为 props 字段    |
| scrollReachBottom  |                          () => void                          |            -             |    否    |                     触发加载更多时的函数                     |
|      reRender      |                          () => void                          |            -             |    -     |          通过 ref 可直接调用该组件方法进行重新渲染           |
|    insertBefore    |                (insertList) => Promise\<void>                |            -             |    -     |    通过 ref 可直接调用该组件方法往`list`首部插入元素列表     |

#### 3.1 特殊字段说明

- `scrollBodySelector`和`isMounted`

有时候我们的滚动不是相对于`window`对象，而是某个单独的父元素，这需要`scrollBodySelector`和`isMounted`字段配合。

```vue
<div class="father-box">
  <v3-waterfall scrollBodySelector=".father-box" :isMounted="isMounted"></v3-waterfall>
</div>

<script>
// 父组件
// ...
  setup () {
    const isMounted = ref(false)

    onMounted(() => {
      isMounted.value = true
    })

    return { isMounted }
  }
</script>

<style>
.father-box {
  height: 300px; /* 父元素一定要指定高度 */
  overflow-y: scroll; /* 一定要指定父元素超出滚动 */
}
</style>
```

由于子组件的`mounted`生命周期比父组件`mounted`先执行，所以需要通过父组件主动通知已挂载完成后，子组件才能往`div.father-box`元素上添加滚动监听等事件。
&nbsp;

- `virtualTime`和`virtualLength`

提供数据量过大时的虚拟列表支持，如果数量不多，可以不开启。`virtualTime`是开启虚拟列表的关键，配置的是滚动事件发生后多久进行虚拟列表的计算，默认值为 0 ，此时不开启虚拟列表。如果需要使用，建议设置≥400的值。

`virtualLength`指的是当一个元素随着滚动消失在视窗外(可能消失在上方、下方)的距离需要被隐藏。

- `heightHook`高度自定义钩子

组件内部支持自动计算元素块高度，但会对图片进行预加载后才进行计算，如果图片过大，会造成局部白屏时间太久。由于部分用户能够从接口获取每个元素中涉及的图片宽高数据，因此提供该钩子给用户自己计算高度，提升渲染性能。下面举个简单示例：

```vue
<div>
  <v3-waterfall ref="v3WaterfallRef" :list="list" :height-hook="heightHook"></v3-waterfall>
</div>

<script setup lang="ts" generic="T extends object">
import { render, ref, type Ref } from 'vue'

const list = ref([]) as Ref<T[]>
/*
此处场景设定为：每个卡片由一张图片+若干文字+其他标签框组成，且图片显示宽度为元素宽度，高度自适应

item 中的数据(从接口获取来的列表数据)包括:
{
  title: '标题',
  cover: 'http://xxx.xxx.com/xxx.png',
  cover_width: 800,
  cover_height: 500,
  tags: [‘tag1’, 'tag2']
}

*/

/**
 * 计算元素高度
 * @param {SlotsType} slots 内部 slots 组
 * @param {T} item 该元素块对应数据信息
 * @param {number} width 元素块宽度
 * @param {string} errorImgSrc 用户提供的错误图片
 * @returns {Promise<number>} 高度
 */
const heightHook = (slots, item, width, errorImgSrc) => {
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.left = '-1000px'
  div.style.width = width + 'px'
  div.style.visibility = 'hidden'

  // 使用 render 函数渲染出卡片 slot
  render(h(slots.default, { item }), div)

  // 将图片隐藏，图片的高度额外计算
  const img = div.querySelector('img')
  img.style.display = 'none'
  // 计算除图片外其他元素的高度
  const body = document.body || document.documentElement
  body.appendChild(div)
  const otherHeight = div.offsetHeight
  body.removeChild(div)

  // 单独计算图片实际展示高度
  const imgHeight = (width / item.cover_width) * item.cover_height
  // 返回该卡片的整体高度
  return imgHeight + otherHeight
}
</script>
```

- `reRender`和`insertBefore`

这两个方法暴露给组件`ref`直接调用，`reRender`方法适用于卡片内容发生变化需要重新渲染计算高度的场景，如卡片全部隐藏标题块；`insertBefore`方法适用需要在列表头部新增数据，例如下拉刷新加载，此方法不会重新计算已加载的卡片。示例如下：

```vue
<div>
  <v3-waterfall ref="v3WaterfallRef" :list="list"></v3-waterfall>
</div>

<script setup lang="ts" generic="T extends object">
import { ref, type Ref } from 'vue'
// 引入该类型支持方法调用类型提示
import type { V3WaterfallExpose } from 'v3-waterfall'

const list = ref([]) as Ref<T[]>
// 需要插入在最前面的元素组
const insertBeforeList = []

const v3WaterfallRef = ref<V3WaterfallExpose<T> | null>(null)

// 调用重渲染
v3WaterfallRef.value?.reRender()
// 调用头部插入，此方法会自动插入 list 当中，无须手动再次插入
const insertBefore = async () => {
  // 此处可以使用变量控制下拉 loading 状态的变化(请与组件的滚动底部 loading 区分)
  // pullLoading.value = true
  await v3WaterfallRef.value?.insertBefore(insertBeforeList)
  // pullLoading.value = false
}
insertBefore()
</script>
```

&nbsp;

### 4.slot插槽

#### 4.1 默认插槽(v-slot:default)

瀑布流卡片展示内容，自定义，展示什么，添加什么事件，可扩展。

#### 4.2 加载插槽(v-slot:loading)

加载中在瀑布流底部显示的状态，默认为 5 个大小变化的点。

#### 4.3 底部插槽(v-slot:footer)

数据全部加载完之后在底部显示的内容，默认为`呀，被看光了！`。

&nbsp;

### 5.迁移指南

从 1.x 迁移至 2.x 请参考`docs/`目录下的[migration.md](/docs/migration.md).
