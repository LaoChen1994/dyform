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
      external: ['vue', 'pdform/core'],
      output: {
        globals: {
          vue: 'Vue',
          'pdform/core': 'PdformCore',
        },
      },
    },
  },
  resolve: {
    alias: {
      'pdform/core': path.resolve(__dirname, '../core/src'),
    },
  },
});
