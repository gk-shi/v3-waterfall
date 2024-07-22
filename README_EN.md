## v3-waterfall

a waterfall plugin for Vue 3.

&nbsp;

<p align="center">
  <a href="https://npmjs.com/package/v3-waterfall"><img src="https://img.shields.io/npm/v/v3-waterfall.svg" alt="npm package"></a>
  <a href="https://img.shields.io/npm/dt/v3-waterfall"><img src="https://img.shields.io/npm/dt/v3-waterfall.svg" alt="downloads"></a>
  <a href="https://img.shields.io/npm/l/v3-waterfall"><img src="https://img.shields.io/npm/l/v3-waterfall.svg" alt="downloads"></a>
</p>

Document: [中文](/README.md) | English

> English doc Translated by ChatGPT 3.5

[Online Demo](https://gk-shi.github.io/v3-waterfall/)

If you need to use this component in umd format, please refer to：[v3-waterfall-umd-demo](https://codesandbox.io/p/sandbox/v3-waterfall-umd-demo-xd79l5?file=%2Findex.html%3A158%2C21)

This demo is the content of `src/` directory in this project.

Used in personal blog:[Here](https://gkshi.com/blog)

> Version 2.x is incompatible with updates from version 1.x. For migration instructions, please refer to the document provided at the end.
>
> If you need to look at the document of version 1.x, please refer to [v1-README.md](/docs/v1-README.md) located in the `docs/` directory. Generally, version 1.x will no longer be supported.

&nbsp;

### 1.Features

- A waterfall component for Vue 3
- Support no-image mode and default error image
- Automatically calculates layout for image preloading without the need to specify image dimensions（**Version 2.x now supports multi-image mode and custom provision of element heights**）
- Responsive layout design
- Support for binding to scrolling parent element
- Support virtual list
- Support inserting elements at the beginning of the list（**Already supported in version 2.x, meeting scenarios like pull-to-refresh**）

&nbsp;

### 2.Usage

#### 2.1 install

```shell
pnpm add v3-waterfall
```

#### 2.2 register plugin

```typescript
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import V3waterfall from 'v3-waterfall'
import 'v3-waterfall/dist/style.css'

createApp(App).use(V3waterfall).mount('#app')
```

#### 2.3 using

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
          <!-- Note: "data-key" is the field name of the image. Currently, it only supports fields at the first level and does not support nesting -->
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

> Note⚠️：
>
> 1.Although multiple loading verifications have been implemented, strive to ensure that the initially loaded data is sufficient to enable scrolling
>
> 2.When performing incremental updates to the list, please use `list.value = list.value.concat(addedList)`. This is because the component internally handles incremental loading. If you use the `push` method to add items, it may trigger multiple times. Therefore, the response to `push` is canceled when listening
>
> 3.Note the usage of the `img` tag in the above code. For all images within slots that are not within containers with fixed heights (i.e., images that affect the element's height), they must include the `data-key` field, as specified in the comment above. (You can ignore this requirement if you provide a method for calculating element heights.)

The specific code for the basic example can be found in `src/App.vue`. Additionally, you can see the effect by running the project using `pnpm dev`.

&nbsp;

### 3.Component Parameter Description

|     parameter      |                             type                             |         default          | required |                         description                          |
| :----------------: | :----------------------------------------------------------: | :----------------------: | :------: | :----------------------------------------------------------: |
|        list        |                            array                             |            []            |   yes    |                     Waterfall list data                      |
|      colWidth      |                    number \| () => number                    |           250            |    no    | The width of the waterfall cards,**Currently, different screen widths require writing a function to return the corresponding width** |
|        gap         |                    number \| () => number                    |            20            |    no    |          Spacing between the two columns, unit：px           |
|     bottomGap      |                    number \| () => number                    |            10            |    no    |      Spacing between the top and bottom cards, unit：px      |
|     isLoading      |                           boolean                            |          false           |   yes    | Control displaying loading state prompt when requesting data |
|       isOver       |                           boolean                            |          false           |   yes    | Control whether all data has been loaded (i.e., no need for further scroll loading) |
|       active       |                           boolean                            |           true           |    no    | *Confirm whether the current instance is activated when multiple `v3-waterfall` components are used similar to the `van-tabs` component*,[e.g.](https://codesandbox.io/p/devbox/v3-waterfall-van-tabs-24h8f5?file=%2Fsrc%2FApp.vue%3A69%2C33) |
|   swipeableDelay   |                            number                            |            0             |    no    | *Similar to the `swipeable` attribute of `van-tabs`, when enabled, it may fail to load successfully by immediately sliding to another tab upon rendering. This value needs to be set, recommended as 300, and adjusted according to the actual situation*,[e.g.](https://codesandbox.io/p/devbox/v3-waterfall-van-tabs-24h8f5?file=%2Fsrc%2FApp.vue%3A69%2C33) |
|     dotsCount      |                            number                            |            5             |    no    |           Number of dots to display during loading           |
|     dotsColor      |                            string                            | rgba(169, 169, 169, 0.8) |    no    |          Color of the dots displayed during loading          |
|      overText      |                            string                            |      呀，被看光了！      |    no    |                          Over text                           |
|     overColor      |                            string                            |         \#999999         |    no    |                      Over color of text                      |
|     animation      |                           boolean                            |           true           |    no    |                  Enable built-in animation                   |
|    errorImgSrc     |                            string                            |            -             |    no    | The URL of the image displayed when loading fails. There are built-in images available |
|  distanceToScroll  |                            number                            |           200            |    no    | The distance from the bottom that triggers loading., unit：px |
| scrollBodySelector |                            string                            |            -             |    no    | Binding to the scrolling parent element selector, defaulting to the `window` object. Used in conjunction with the `isMounted` parameter |
|     isMounted      |                           boolean                            |          false           |    no    | Whether the parent component has mounted, used with the `scrollBodySelector` parameter |
|    virtualTime     |                            number                            |            0             |    no    | The time interval for triggering virtual list validation. Default is 0, indicating virtual list is not enabled by default |
|   virtualLength    |                            number                            |           500            |    no    | The default distance from the viewport to activate virtual hiding, unit: px |
|     heightHook     | null \| (slots, item, width, errorImgSrc) => Promise\<number> |            -             |    no    | Custom element block height function hook, supports Promise. This is a props field |
| scrollReachBottom  |                          () => void                          |            -             |    no    |          Function triggered when loading more items          |
|      reRender      |                          () => void                          |            -             |    -     | You can directly call the component methods for re-rendering using `ref` |
|    insertBefore    |                (insertList) => Promise\<void>                |            -             |    -     | You can directly call the component methods to insert a list of elements at the beginning of `list` using `ref` |

#### 3.1 special field instructions

- `scrollBodySelector` and `isMounted`

Sometimes our scrolling isn't relative to the `window` object, but rather to a specific parent element. This requires the `scrollBodySelector` and `isMounted` fields to work together.

```vue
<div class="father-box">
  <v3-waterfall scrollBodySelector=".father-box" :isMounted="isMounted"></v3-waterfall>
</div>

<script>
// parent component
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
  height: 300px; /* The parent element must have a specified height */
  overflow-y: scroll; /* The parent element must have overflow set to scroll */
}
</style>
```

Since the child component's `mounted` lifecycle hook is executed before the parent component's `mounted`, the parent component needs to actively notify when it has finished mounting. Only then can the child component add scroll listeners and other events to the `div.father-box` element.
&nbsp;

- `virtualTime` and `virtualLength`

Provide support for virtual lists when dealing with large amounts of data. If the quantity is small, it can be left disabled. `virtualTime` is the key to enabling virtual lists. It configures how long after the scroll event occurs the virtual list calculation should take place. The default value is 0, indicating that virtual lists are not enabled. If needed, it is recommended to set a value of ≥400.

`virtualLength` refers to the distance from the viewport at which an element disappears from view (potentially above or below) and needs to be hidden.

- `heightHook` is a hook for customizing height

The component supports automatic calculation of element block heights. However, it calculates them only after preloading images. If the images are too large, it may result in a long white screen time. Since some users can obtain image width and height data for each element from the API, we provide this hook for users to calculate heights themselves, thus improving rendering performance. Below is a simple example:

```vue
<div>
  <v3-waterfall ref="v3WaterfallRef" :list="list" :height-hook="heightHook"></v3-waterfall>
</div>

<script setup lang="ts" generic="T extends object">
import { render, ref, type Ref } from 'vue'

const list = ref([]) as Ref<T[]>
/*
In this scenario, each card consists of an image, some text, and other elements, with the image displayed at the width of the element and the height adapting accordingly.

The data in each item (obtained from the API) includes:
{
  title: '标题',
  cover: 'http://xxx.xxx.com/xxx.png',
  cover_width: 800,
  cover_height: 500,
  tags: [‘tag1’, 'tag2']
}

*/

/**
 * Calculate element height
 * @param {SlotsType} slots: Internal slots group
 * @param {T} item: Data information corresponding to the element block
 * @param {number} width: Element block width
 * @param {string} errorImgSrc: User-provided error image
 * @returns {Promise<number>} Height
 */
const heightHook = (slots, item, width, errorImgSrc) => {
  const div = document.createElement('div')
  div.style.position = 'absolute'
  div.style.left = '-1000px'
  div.style.width = width + 'px'
  div.style.visibility = 'hidden'

  // Render the card slot using the render function
  render(h(slots.default, { item }), div)

  // Hide the image, with additional consideration for the height of the image
  const img = div.querySelector('img')
  img.style.display = 'none'
  // Calculate the height of elements excluding the image
  const body = document.body || document.documentElement
  body.appendChild(div)
  const otherHeight = div.offsetHeight
  body.removeChild(div)

  // Calculate the actual display height of the image separately
  const imgHeight = (width / item.cover_width) * item.cover_height
  // Return the overall height of the card
  return imgHeight + otherHeight
}
</script>
```

- `reRender`and `insertBefore`

These two methods are exposed for direct invocation by the component `ref`. The `reRender` method is suitable for scenarios where the content of the card changes and the height needs to be recalculated, such as when all titles in the card are hidden. The `insertBefore` method is suitable for adding new data at the beginning of the list, such as loading by pulling down to refresh. This method does not recalculate the heights of already loaded cards. Examples are as follows:

```vue
<div>
  <v3-waterfall ref="v3WaterfallRef" :list="list"></v3-waterfall>
</div>

<script setup lang="ts" generic="T extends object">
import { ref, type Ref } from 'vue'
// Import the type to support method invocation type prompts
import type { V3WaterfallExpose } from 'v3-waterfall'

const list = ref([]) as Ref<T[]>
// Elements to be inserted at the beginning
const insertBeforeList = []

const v3WaterfallRef = ref<V3WaterfallExpose<T> | null>(null)

// Invoke re-rendering
v3WaterfallRef.value?.reRender()
// Invoke insertion at the beginning, this method will automatically insert into the list, no need to insert manually again
const insertBefore = async () => {
  // You can use variables here to control the change of pull-down loading state (please distinguish from the component's scroll bottom loading)
  // pullLoading.value = true
  await v3WaterfallRef.value?.insertBefore(insertBeforeList)
  // pullLoading.value = false
}
insertBefore()
</script>
```

&nbsp;

### 4.Slots

#### 4.1 default slot(v-slot:default)

Customize the content displayed in the waterfall flow card, show what you want, add what events you need, extendable.

#### 4.2 loading slot(v-slot:loading)

The loading state displayed at the bottom of the waterfall flow when loading, defaulting to 5 dots of varying sizes.

#### 4.3 footer slot(v-slot:footer)

The content displayed at the bottom after all data is loaded, defaulting to`呀，被看光了！`。

&nbsp;

### 5.Migration Guide

For migrating from 1.x to 2.x, please refer to the [migration.md](/docs/migration.md) file in the `docs/` directory.
