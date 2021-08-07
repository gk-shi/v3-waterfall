import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

const target = process.env.TARGET
let buildConfig = {
  lib: {
    entry: path.resolve(__dirname, 'lib/index.ts'),
    name: 'v3-waterfall'
  },
  rollupOptions: {
    external: ['vue'],
    output: {
      globals: {
        vue: 'Vue'
      }
    }
  }
}

if (target === 'page') {
  buildConfig = {
    outDir: 'github-page'
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: { ...buildConfig },
  plugins: [vue()]
})
