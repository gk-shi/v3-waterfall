const data = [
  {
    tags: [
      'vue',
      'react',
      'diff'
    ],
    cover: 'https://image.gkshi.com/202142113503diff-cover.png',
    outline: '在 Vue 2.x 以及 React 中，为了提升应用的性能，都引入了一个概念: Virtual DOM。简单来说，Virtual DOM 就是一棵用 JS 来描述的应用结构树，它与实际 DOM 树相对应。',
    _id: '607fbd150ae17a86a8ca9e4b',
    title: 'Vue 2.x 以及 React (<16) diff 算法简单分析',
    created_time: '04-21 2021'
  },
  {
    tags: [
      '小程序',
      ''
    ],
    cover: 'https://image.gkshi.com/202149153713miniprogram.jpeg',
    outline: '如题，无论是在普通的 Web 开发还是在微信小程序项目的开发中，无疑我们都至少会有测试环境以及正式环境的区别。',
    _id: '6070043d0ae17a86a8ca9e48',
    title: '微信小程序如何自动切换环境接口地址',
    created_time: '04-09 2021'
  },
  {
    tags: [
      'vue',
      'webpack',
      'npm'
    ],
    cover: 'https://image.gkshi.com/20211201513vue-cli-element.jpg',
    outline: '在工作中，后台项目使用的是 vue 2.x 配合 Element 来实现的。但是由于项目太老，Element 的版本也很早，导致很多功能都有缺失，多数现有需求都要进行重复的扩展。为了方便团队的开发以及提升体验，便想在 Element 的基础上做一些适合现有业务的封装，并且整合发布成 npm 包。',
    _id: '6007d5550ae17a86a8ca9e21',
    title: 'vue-cli 如何实现Element-ui二次开发npm包',
    created_time: '01-20 2021'
  },
  {
    tags: [
      '本站',
      'typescript',
      ''
    ],
    cover: 'https://image.gkshi.com/2021118224526revision.jpg',
    outline: '盼望着，盼望着，春天的，不对，博客改版的脚本近了...从2020年9月份博客关闭以来，历时5个月的改版，现在终于又双叒上线了！😆',
    _id: '60059f0f0ae17a86a8ca9e12',
    title: '这次改版做了什么？',
    created_time: '01-18 2021'
  },
  {
    tags: [
      'promise',
      'js'
    ],
    cover: '',
    outline: '对于一个前端er来说，Promise 是一个相当熟悉的名词。我们知道它的出现就是为了在一定程度上解决回调地狱的问题。最开始认为 Promise 指的就是 ES6 中的 Promise，实际发现并不是这样，它只是其中的一种实现。更了解发现，其实只要符合 Promise A+ 的规范，都能实现出 Promise，并且能够和其他的实现相通。',
    _id: '5ed61a4af93a5234433bb588',
    title: '写一个自己的符合 Promise A+ 规范的 Promise 类',
    created_time: '06-02 2020'
  },
  {
    tags: [
      'vue',
      'es6',
      'typescript',
      ''
    ],
    cover: 'https://image.gkshi.com/201943095758vue-logo.png',
    outline: 'Vue 3.0 都发布 Beta 公测了，我这连 alpha 版的主要源码都没看完...大清亡了啊😂',
    _id: '5ea945dbf93a5234433bb587',
    title: 'Vue 3.0 源码学习—effect',
    created_time: '04-29 2020'
  },
  {
    tags: [
      'jenkins',
      'docker',
      'CI/CD'
    ],
    cover: 'https://image.gkshi.com/2020421204444jenkins-docker-cover.png',
    outline: '习惯了工作中持续集成部署的流程，现在想要把自己博客的维护也用上jenkins + docker 的模式，来一把酸爽体验！',
    _id: '5e9eecb7f93a5234433bb586',
    title: '前端使用docker和jenkins搭建CI/CD',
    created_time: '04-21 2020'
  },
  {
    tags: [
      'vue',
      'es6',
      'typescript',
      ''
    ],
    cover: 'http://image.gkshi.com/201943095758vue-logo.png',
    outline: '离上篇关于 vue 3.0 的源码学习已经过去老久了，这次要学习的是 reactive.ts 文件，很多东西都看了好几遍，觉得算有点理解了才开始写这个。',
    _id: '5e992444f93a5234433bb583',
    title: 'Vue 3.0 源码学习—reactive',
    created_time: '04-17 2020'
  },
  {
    tags: [
      'demo',
      'test'
    ],
    cover: 'http://image.gkshi.com/not-exist-cover.png',
    outline: '如果图片加载失败，会用默认的错误图片展示。',
    _id: '',
    title: '图片裂开',
    ttt: '',
    created_time: '04-17 2020'
  },
  {
    tags: [
      'es6',
      'javascript'
    ],
    cover: '',
    outline: 'call、apply 方法在实际开发中还是有用到的，学习了它的相关原理，再自己手写一遍来加深自己的理解。',
    _id: '5e89f3a1f93a5234433bb582',
    title: '手写模拟实现 call、apply 方法',
    ttt: '',
    created_time: '04-05 2020'
  },
  {
    tags: [
      'es6',
      ''
    ],
    cover: '',
    outline: '将几个比较有意思的面试题做一个小小的记录。',
    _id: '5e7c35a796575e7d52d442bd',
    title: '几个面试题总结',
    created_time: '03-26 2020'
  }
]

export async function getData (): Promise<unknown[]> {
  return new Promise((resolve, reject) => {
    const ret = JSON.parse(JSON.stringify([...data, ...data]))
    setTimeout(() => {
      resolve(ret)
    }, 100)
  })
}
