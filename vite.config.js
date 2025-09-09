import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://checkpoint-backend-357565914560.asia-east1.run.app',
        //target: 'https://checkpoint-backend-357565914560.asia-east1.run.app/api',
        changeOrigin: true,
        secure: true,
        // 將前綴 /api 移除，讓 /api/user/login → /user/login
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
}) 