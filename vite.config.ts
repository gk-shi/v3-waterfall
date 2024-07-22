import { fileURLToPath, URL } from 'node:url'

import { BuildOptions, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import dts from 'vite-plugin-dts'


const target = process.env.TARGET
let buildConfig: BuildOptions = {
  copyPublicDir: false,
  lib: {
    entry: path.resolve(__dirname, 'lib/index.ts'),
    name: 'V3Waterfall'
  },
  rollupOptions: {
    external: ['vue'],
    output: {
      exports: 'named',
      globals: {
        vue: 'Vue'
      }
    }
  }
}

const plugins = [
  vue(),
  dts({
    // rollupTypes: true,
    // copyDtsFiles: true,
    outDir: 'dist/typings',
    tsconfigPath: './lib/tsconfig.json'
  })
]

if (target === 'page') {
  buildConfig = {
    outDir: 'github-page'
  }
  plugins.pop()
}


// https://vitejs.dev/config/
export default defineConfig({
  base: target === 'page' ? '/v3-waterfall/' : '/',
  build: { ...buildConfig },
  plugins,
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
