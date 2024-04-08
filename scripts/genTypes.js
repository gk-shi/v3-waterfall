import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'
import fs from 'fs/promises'
// 获取 __filename 的 ESM 写法
// const __filename = fileURLToPath(import.meta.url)
// 获取 __dirname 的 ESM 写法
const __dirname = dirname(fileURLToPath(import.meta.url))

// const fs = require('fs/promises')
// const path = require('path')

const targetDir = resolve(__dirname, '../dist/typings')

const src = resolve(__dirname, '../lib/global.d.ts')

const template = `import "./global"`

const main = async () => {
  // 复制全局类型至 dist/typings/ 目录下
  await fs.copyFile(src, `${targetDir}/global.d.ts`)
  // 将其引入 index.d.ts
  await fs.appendFile(`${targetDir}/index.d.ts`, template, 'utf8')
  console.log('\x1b[38;2;152;195;110m%s\x1b[0m', '********* 写入类型文件成功！*********\n')
}

main()

