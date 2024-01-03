import { isString } from "../utils"
import { _v3_error_image } from '../utils/errorImgBase64'



/**
 * @description: 图片预加载
 * @param {WaterfallList<T extends object>} noPreloadList 增量列表
 * @param {string | string[]} srcKey 需要预加载的图片的 key 名(数组)
 * @param {string} errorImgSrc 错误图片链接(需要时完整的)
 * @param {function} callback
 * @return {*}
 */
export default function useImagesPreload<T extends object>(
  noPreloadList: WaterfallList<T>,
  srcKey: string | string[],
  errorImgSrc: string,
  callback: () => void
) {
  const srcKeys = (isString(srcKey) ? [srcKey] : srcKey).filter(s => s)

  // 有一张错误状态图片需要预加载
  const shouldPreloadCount = noPreloadList.length * srcKeys.length + 1
  let preloadCount = 0

  /**
   * 错误图片额外预加载
   * ps: 如果用户填写了错误时的图片，当该图片还是加载失败时，不会切换成内部错误图片
  */
  const errSrc = errorImgSrc || _v3_error_image
  const errorImg = new Image()
  errorImg.onload = errorImg.onerror = (e: Event): void => {
    preloadCount++

    if (preloadCount === shouldPreloadCount) {
      callback && callback()
    }
  }
  errorImg.src = errSrc

  const len = noPreloadList.length
  for (let i = 0; i < len; i++) {
    const target = noPreloadList[i]
    srcKeys.forEach(src => {
      if (!target[src]) {
        preloadCount++
        return
      }
      const oImg = new Image()
      oImg.onload = oImg.onerror = (e: Event) => {
        if (e.type === 'error') {
          target[src] = errSrc
        }
        preloadCount++
        if (preloadCount === shouldPreloadCount) {
          callback && callback()
        }
      }
    })

  }
}
