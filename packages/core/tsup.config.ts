import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts', 'src/types.ts', 'src/utils.ts', 'src/formState.ts', 'src/parser.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  tsconfig: './tsconfig.build.json'
});
