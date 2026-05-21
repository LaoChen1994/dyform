import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
export default defineConfig({
    base: process.env.BASE_PATH || '/',
    plugins: [react()],
    resolve: {
        alias: {
            'pdyform-builder': fileURLToPath(new URL('../../packages/builder/src/index.tsx', import.meta.url)),
            'pdyform-react': fileURLToPath(new URL('../../packages/react/src/index.tsx', import.meta.url)),
            'pdyform-core': fileURLToPath(new URL('../../packages/core/src/index.ts', import.meta.url)),
        },
        dedupe: ['react', 'react-dom'],
    },
});
