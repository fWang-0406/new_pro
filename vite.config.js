import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    host: true, // 允许外部访问
    open: true  // 自动打开浏览器
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
})