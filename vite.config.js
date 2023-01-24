import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://mobilecdn.kugou.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      }, '/yy': {
        target: 'https://wwwapi.kugou.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/yy/, ''),
      }, '/stdmusic': {
        target: 'https://imgessl.kugou.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/stdmusic/, ''),
      }, '/v3': {
        target: 'http://mobilecdnbj.kugou.com/api/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/v3/, ''),
      }
    }
  }
})
