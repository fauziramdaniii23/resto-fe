import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'restobahari.local',
    port: 8080,
    strictPort: true
  },
  resolve: {
    alias: {
      '@': resolve(dirname(fileURLToPath(import.meta.url)), 'src'),
    },
  },
})
