import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PdDynamicFormVue',
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: ['vue', 'pdyform/core'],
      output: {
        globals: {
          vue: 'Vue',
          'pdyform/core': 'PdyformCore',
        },
      },
    },
  },
  resolve: {
    alias: {
      'pdyform/core': path.resolve(__dirname, '../core/src'),
    },
  },
});
