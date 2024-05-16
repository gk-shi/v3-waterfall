type UniqueID = {
  anchorID: string
  wrapperID: string
  itemClass: string
  genNewID: (prefix: string) => string
}

/**
 * @description: 根据时间戳生成几个唯一的变量
 * @return {UniqueID} { anchorID, wrapperID, itemClass, genNewID }
 */
export default function useUniqueID(): UniqueID {
  const timestamp = Date.now()
  const random = String(Math.random()).replace('.', '')
  const anchorID = 'anchor' + timestamp + random
  const wrapperID = 'wrapper' + timestamp + random
  const itemClass = 'item' + timestamp + random

  // 生成新的 id
  const genNewID = (prefix: string): string => prefix + timestamp + random

  return { anchorID, wrapperID, itemClass, genNewID }
}
