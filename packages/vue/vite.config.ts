import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PdDynamicFormVue',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['vue', 'dyform/core'],
      output: {
        globals: {
          vue: 'Vue',
          'dyform/core': 'DyformCore',
        },
      },
    },
  },
  resolve: {
    alias: {
      'dyform/core': path.resolve(__dirname, '../core/src'),
    },
  },
});
