## v3-waterfall 自适应瀑布流组件

&nbsp;
<p align="center">
  <a href="https://npmjs.com/package/v3-waterfall"><img src="https://img.shields.io/npm/v/v3-waterfall.svg" alt="npm package"></a>
  <a href="https://nodejs.org/en/about/releases/"><img src="https://img.shields.io/node/v/vite.svg" alt="node compatibility"></a>
  <a href="https://img.shields.io/npm/dt/v3-waterfall"><img src="https://img.shields.io/npm/dt/v3-waterfall.svg" alt="downloads"></a>
  <a href="https://img.shields.io/npm/l/v3-waterfall"><img src="https://img.shields.io/npm/l/v3-waterfall.svg" alt="downloads"></a>
</p>

&nbsp;

> 本组件支持 ESM 和 UMD 两种方式引入。


[在线Demo](https://gk-shi.github.io/v3-waterfall/)

该 demo 即为本项目`example/`内容。

个人博客使用地址：[这里](https://gkshi.com/blog)

&nbsp;
### 1.支持功能

- 一个针对 vue 3 的瀑布流组件
- 支持无图模式及图片加载失败时默认图片
- 图片预加载自动计算排版，不需要指定图片宽高
- 响应式排版
- 支持绑定滚动父元素

&nbsp;
### 2.使用方法

#### 2.1 安装

```shell
npm i v3-waterfall
```

#### 2.2 注册组件

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/dist/style.css'


createApp(App)
  .use(V3waterfall)
  .mount('#app')

```

#### 2.3 引入使用

```vue
<v3-waterfall class="waterfall" :list="list" srcKey="cover" :gap="12" :colWidth="280"
              :distanceToScroll="200" :isLoading="loading" :isOver="over" @scrollReachBottom="getNext">
  <template v-slot:default="slotProp">
    <div class="list-item">
      <a :href="'https://gkshi.com/blog/' + slotProp.item._id">
        <div class="cover-wrapper">
          <img v-if="slotProp.item.cover" :src="slotProp.item.cover" class="cover" />
        </div>
        <div class="brief">
          <h3>{{ slotProp.item.title }}</h3>
          <p>{{ slotProp.item.outline }}</p>
        </div>
      </a>
    </div>
  </template>
</v3-waterfall>
```





更为完整的基本示例在`example/App.vue`中有具体代码，同时本项目`yarn dev`运行起来的项目即能看到效果。


&nbsp;
### 3.组件参数说明

|        参数        |   类型   |          默认值          |                             描述                             |
| :----------------: | :------: | :----------------------: | :----------------------------------------------------------: |
|        list        |  Array   |            []            |                **必填项**<br />瀑布流列表数据                |
|      colWidth      |  Number  |           250            |    瀑布流卡片宽度，如果屏幕实际宽度小于设置值，会动态计算    |
|       srcKey       |  String  |           src            |     如果`list`中对应图片地址字段不是`src`，可以特别指定      |
|        gap         |  Number  |            20            |                 两列间的间距，pc端，单位：px                 |
|     mobileGap      |  Number  |            8             |                两列间的间距，移动端，单位：px                |
|     bottomGap      |  Number  |            10            |                   上下卡片的间距，单位：px                   |
|     isLoading      | Boolean  |          false           |                控制请求数据时显示加载状态提示                |
|       isOver       | Boolean  |          false           |       控制数据是否已经全部加载完成(即不需要再滚动加载)       |
|     dotsColor      |  String  | rgba(169, 169, 169, 0.8) |                      加载中显示点的颜色                      |
|      dotsNum       |  Number  |            5             |                      加载中显示点的数量                      |
|  distanceToScroll  |  Number  |           200            |                 距离底部多远距离触发数据加载                 |
| scrollBodySelector |  String  |            -             | 绑定滚动父元素选择器，默认为`window`对象，与`isMounted`参数配合使用 |
|     isMounted      | Boolean  |          false           |     父组件是否挂载完成，配合`scrollBodySelector`参数使用     |
|    errorImgSrc     |  String  |            -             |                 图片加载失败时展示的图片地址                 |
| scrollReachBottom  | Function |            -             |                     触发加载更多时的函数                     |



#### 3.1 特殊字段说明

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
    overflow-y: scroll; /* 一定要制定父元素超出滚动 */
  }
</style>
```

由于子组件的`mounted`生命周期比父组件`mounted`先执行，所以需要通过父组件主动通知已挂载完成后，子组件才能往`div.father-box`元素上添加滚动监听等事件。


&nbsp;
### 4.slot插槽

#### 4.1 默认插槽(v-slot:default)

瀑布流卡片展示内容，完全自主定义，展示什么，添加什么事件，完全可扩展。



#### 4.2 加载插槽(v-slot:loading)

加载中在瀑布流底部显示的状态，默认为 5 个大小变化的点。



#### 4.3 底部插槽(v-slot:footer)

数据全部加载完之后再底部显示的内容，默认为`呀，被看光了！`。