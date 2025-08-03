import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: true,
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      host: true,
      proxy: command === 'serve' ? {
        '/api': {
          target: 'http://localhost:5000',  // Backend server port
          changeOrigin: true,
          secure: false,
          // Remove the rewrite to maintain the /api prefix
          // rewrite: (path) => path.replace(/^\/api/, '')
        }
      } : undefined
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        'Assets': path.resolve(__dirname, './Assets')   
      }
    },
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg']
  }
});