import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  root: __dirname,
  appType: 'spa',
  plugins: [react()],
  resolve: {
    alias: {
      '@propimatch/types': resolve(__dirname, '../../packages/types/src'),
      '@propimatch/theme': resolve(__dirname, '../../packages/theme/src'),
      '@propimatch/data': resolve(__dirname, '../../packages/data/src')
    }
  },
  server: {
    host: true,
    port: 5175,
    strictPort: true,
  }
});

