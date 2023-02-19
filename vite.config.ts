import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'index.cjs'),
      name: 'tao',
      fileName: 'tao',
    }
  }
})