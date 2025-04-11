import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: 'https://sage-shield.onrender.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, _req, _res) => {
            proxyReq.setHeader('Origin', 'https://sage-shield.onrender.com');
            proxyReq.setHeader('Accept', 'application/json');
          });
        }
      }
    },
    cors: false
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'Assets': path.resolve(__dirname, './Assets')   
    }
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
});