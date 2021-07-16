/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComputedRef, Ref, ref, nextTick } from 'vue'

export type ListItem = Record<string, any>
type ImagePreload = {
  actualList: Ref<ListItem[]>;
  setLastPreloadImgIdx: (idx: number) => void;
  setActualList: (newList: ListItem[]) => void;
  imagePreloadHandle: (noPreloadList: ListItem[], actualColWidth: Ref<number>, preloadedFn: () => unknown | undefined, srcKey: string, errorImgHeight: ComputedRef<number>, errorImgSrc: string) => void;
}

export default function imagePreload (): ImagePreload {
  const actualList = ref<ListItem[]>([])  // 实际用来渲染的列表
  const setActualList = (newList: ListItem[]): void => {
    actualList.value = newList
  }


  let lastPreloadImgIdx = -1  // 上一次最后预加载的图片的下标

  const setLastPreloadImgIdx = (idx: number): void => {
    lastPreloadImgIdx = idx
  }


  /**
   * @description: 图片预加载
   * @param {ListItem[]} noPreloadList 未进行预加载的列表
   * @param {Ref<number>} actualColWidth 实际列宽
   * @param {Function | undefined} preloadedFn 预加载完成后的回调
   * @param {string} srcKey 存放图片链接的键名
   * @param {ComputedRef<number>} errorImgHeight 错误图片展示高度
   * @param {string} errorImgSrc 图片加载失败时默认图片地址
   * @return {void}
   */
  const imagePreloadHandle = (noPreloadList: ListItem[], actualColWidth: Ref<number>, preloadedFn: () => unknown | undefined, srcKey: string, errorImgHeight: ComputedRef<number>, errorImgSrc: string): void => {
    let tmpIdx = lastPreloadImgIdx + 1
    const tmpArr: ListItem[] = []
    while (tmpIdx < noPreloadList.length) {
      const item = noPreloadList[tmpIdx]
      tmpArr.push(item)
      tmpIdx++
      if (!item[srcKey]) {
        lastPreloadImgIdx++
        item._height = 0
        continue
      }
      const oImg = new Image()
      oImg.src = item[srcKey]
      oImg.onload = oImg.onerror = (e): void => {
        if ((e as Event).type === 'error') {
          item[srcKey] = errorImgSrc
          item._height = errorImgHeight.value
        } else if ((e as Event).type === 'load') {
          item._height = Math.round(actualColWidth.value / (oImg.width / oImg.height))
        }
        lastPreloadImgIdx++
        if (lastPreloadImgIdx + 1 === noPreloadList.length) {
          // 预加载完成，开始渲染
          actualList.value = actualList.value.concat(tmpArr)
          nextTick(() => {
            // 图片预加载完成后的回调
            preloadedFn && preloadedFn()
          })
        }
      }
    }
  }

  return {
    actualList,
    setActualList,
    setLastPreloadImgIdx,
    imagePreloadHandle
  }
}
