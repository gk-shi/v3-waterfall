### v1 迁移文档

由于 v2 版本删除了内置的移动端等情况的判断，并且支持了多图模式，因此部分涉及多端展示、图片的字段需要调整。

- `colWidth`：瀑布流卡片宽度

该字段由`number`转为`number | () => number`，如果需要多端展示不同宽度，需要自己写函数判断。

```javascript
const getColWidth = () => {
  const device = /(Android|iPhone|iPod|iOS|SymbianOS|Windows Phone)/gi.test(userAgent)
    ? 'mobile'
    : /iPad/gi.test(userAgent)
      ? 'ipad'
      : 'pc'

  const widthMap = {
    mobile: 200,
    ipad: 250,
    pc: 250
  }
  return widthMap[device]
}
```

- `gap`：两列间的间距，单位：px

同上。

- `bottomGap`：上下卡片的间距，单位：px

同上。

- `mobileGap`：~~两列间的间距，移动端~~

**废弃**。

- `srcKey`：~~`list`中图片地址字段~~

**废弃**。删除该字段后，需要在卡片插槽内的每个动态影响卡片高度的`img`标签增加一个`data-key`的字段属性标明，具体使用方法查看 README.md 文档说明。

其余新增内容，请查看新的 README.md 文档查看使用方法。
