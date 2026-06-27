import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      // SSE stream endpoint — needs no buffering and a persistent connection
      '/api/ask/stream': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        headers: { Connection: 'keep-alive' },
      },
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
});
