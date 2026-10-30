import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@creatag/core': path.resolve(__dirname, '../packages/core/src/index.ts'),
      '@creatag/render-dom': path.resolve(__dirname, '../packages/render-dom/src/index.ts'),
    },
  },
});
