import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';
import path from 'path';

export default defineConfig(({ command }) => ({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: 'PdDynamicFormVue',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`,
    },
    rollupOptions: {
      external: [
        'vue',
        'pdyform/core',
        'radix-vue',
        'lucide-vue-next',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      output: {
        globals: {
          vue: 'Vue',
          'pdyform/core': 'PdyformCore',
          'radix-vue': 'radixVue',
          'lucide-vue-next': 'lucideVueNext',
          'class-variance-authority': 'classVarianceAuthority',
          clsx: 'clsx',
          'tailwind-merge': 'tailwindMerge',
        },
      },
    },
  },
  resolve: {
    // Use source alias in local dev for faster iteration, avoid alias during build
    // so Rollup can treat pdyform/core as external.
    alias: command === 'serve'
      ? {
          'pdyform/core': path.resolve(__dirname, '../core/src'),
        }
      : {},
  },
}));
