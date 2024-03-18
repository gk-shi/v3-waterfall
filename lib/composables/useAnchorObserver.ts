export default function useAnchorObserver() {
  // 使用 IntersectionObserver
  let intersectionObserver: IntersectionObserver

  const anchorObserver = (scrollElement: null | HTMLElement, anchor: HTMLElement, cb: () => void) => {
    intersectionObserver && intersectionObserver.disconnect()
    intersectionObserver = new IntersectionObserver((entries) => {
      // 如果 intersectionRatio 为 0，则目标在视野外，
      // 我们不需要做任何事情。
      if (entries[0].intersectionRatio <= 0) return
      cb && cb()
    }, {
      root: scrollElement
    })
    // 开始监听
    anchor && intersectionObserver.observe(anchor)
  }

  const anchorDisconnect = () => {
    intersectionObserver && intersectionObserver.disconnect()
  }

  // 校验加载一次数据后底部锚点元素是否隐藏
  const anchorIsHidden = (scrollElement: null | HTMLElement, viewport: HTMLElement, anchor: HTMLElement): boolean => {
    let isHidden = true
    const anchorTop = anchor.getBoundingClientRect().top
    if (!scrollElement) {
      if (anchorTop <= viewport.clientHeight) {
        isHidden = false
      }
    } else {
      const viewportTop = viewport.getBoundingClientRect().top
      const viewportClientHeight = viewport.clientHeight
      if (anchorTop - viewportTop <= viewportClientHeight) {
        isHidden = false
      }
    }
    return isHidden
  }

  return {
    anchorObserver,
    anchorDisconnect,
    anchorIsHidden
  }
}