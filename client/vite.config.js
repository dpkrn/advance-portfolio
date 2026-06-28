import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

const API_TARGET = process.env.API_TARGET || 'http://localhost:5001';

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
      '/api/ask/stream': {
        target: API_TARGET,
        changeOrigin: true,
        headers: { Connection: 'keep-alive' },
      },
      '/api': {
        target: API_TARGET,
        changeOrigin: true,
      },
    },
  },
});
