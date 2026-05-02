import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom']
        }
      }
    }
  },
  server: {
    proxy: {
      '/relay.php': {
        target: 'http://hrpauth.samuelcheston.com', // 你的目标后端
        changeOrigin: true,

        // 🔥 关键：把 /relay.php 去掉，后面的路径原样透传
        rewrite: (path) => path.replace(/^\/relay\.php/, '')
      }
    }
  }
})