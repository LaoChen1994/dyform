// vite.config.ts
import { defineConfig } from "file:///Users/pidan/Work/Learn/dynamic-form/node_modules/.pnpm/vite@5.4.21_@types+node@20.19.35/node_modules/vite/dist/node/index.js";
import vue from "file:///Users/pidan/Work/Learn/dynamic-form/node_modules/.pnpm/@vitejs+plugin-vue@5.2.4_vite@5.4.21_@types+node@20.19.35__vue@3.5.29_typescript@5.9.3_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///Users/pidan/Work/Learn/dynamic-form/node_modules/.pnpm/vite-plugin-dts@4.5.4_@types+node@20.19.35_rollup@4.59.0_typescript@5.9.3_vite@5.4.21_@types+node@20.19.35_/node_modules/vite-plugin-dts/dist/index.mjs";
import path from "path";
var __vite_injected_original_dirname = "/Users/pidan/Work/Learn/dynamic-form/packages/vue";
var vite_config_default = defineConfig(({ command }) => ({
  plugins: [vue(), dts({ rollupTypes: true })],
  build: {
    lib: {
      entry: path.resolve(__vite_injected_original_dirname, "src/index.ts"),
      name: "PdDynamicFormVue",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "js"}`
    },
    rollupOptions: {
      external: [
        "vue",
        "pdyform/core",
        "radix-vue",
        "lucide-vue-next",
        "class-variance-authority",
        "clsx",
        "tailwind-merge"
      ],
      output: {
        globals: {
          vue: "Vue",
          "pdyform/core": "PdyformCore",
          "radix-vue": "radixVue",
          "lucide-vue-next": "lucideVueNext",
          "class-variance-authority": "classVarianceAuthority",
          clsx: "clsx",
          "tailwind-merge": "tailwindMerge"
        }
      }
    }
  },
  resolve: {
    // Use source alias in local dev for faster iteration, avoid alias during build
    // so Rollup can treat pdyform/core as external.
    alias: command === "serve" ? {
      "pdyform/core": path.resolve(__vite_injected_original_dirname, "../core/src")
    } : {}
  }
}));
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvcGlkYW4vV29yay9MZWFybi9keW5hbWljLWZvcm0vcGFja2FnZXMvdnVlXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvVXNlcnMvcGlkYW4vV29yay9MZWFybi9keW5hbWljLWZvcm0vcGFja2FnZXMvdnVlL3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9Vc2Vycy9waWRhbi9Xb3JrL0xlYXJuL2R5bmFtaWMtZm9ybS9wYWNrYWdlcy92dWUvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcbmltcG9ydCB2dWUgZnJvbSAnQHZpdGVqcy9wbHVnaW4tdnVlJztcbmltcG9ydCBkdHMgZnJvbSAndml0ZS1wbHVnaW4tZHRzJztcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoKHsgY29tbWFuZCB9KSA9PiAoe1xuICBwbHVnaW5zOiBbdnVlKCksIGR0cyh7IHJvbGx1cFR5cGVzOiB0cnVlIH0pXSxcbiAgYnVpbGQ6IHtcbiAgICBsaWI6IHtcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2luZGV4LnRzJyksXG4gICAgICBuYW1lOiAnUGREeW5hbWljRm9ybVZ1ZScsXG4gICAgICBmb3JtYXRzOiBbJ2VzJywgJ2NqcyddLFxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBpbmRleC4ke2Zvcm1hdCA9PT0gJ2VzJyA/ICdtanMnIDogJ2pzJ31gLFxuICAgIH0sXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgZXh0ZXJuYWw6IFtcbiAgICAgICAgJ3Z1ZScsXG4gICAgICAgICdwZHlmb3JtL2NvcmUnLFxuICAgICAgICAncmFkaXgtdnVlJyxcbiAgICAgICAgJ2x1Y2lkZS12dWUtbmV4dCcsXG4gICAgICAgICdjbGFzcy12YXJpYW5jZS1hdXRob3JpdHknLFxuICAgICAgICAnY2xzeCcsXG4gICAgICAgICd0YWlsd2luZC1tZXJnZScsXG4gICAgICBdLFxuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIGdsb2JhbHM6IHtcbiAgICAgICAgICB2dWU6ICdWdWUnLFxuICAgICAgICAgICdwZHlmb3JtL2NvcmUnOiAnUGR5Zm9ybUNvcmUnLFxuICAgICAgICAgICdyYWRpeC12dWUnOiAncmFkaXhWdWUnLFxuICAgICAgICAgICdsdWNpZGUtdnVlLW5leHQnOiAnbHVjaWRlVnVlTmV4dCcsXG4gICAgICAgICAgJ2NsYXNzLXZhcmlhbmNlLWF1dGhvcml0eSc6ICdjbGFzc1ZhcmlhbmNlQXV0aG9yaXR5JyxcbiAgICAgICAgICBjbHN4OiAnY2xzeCcsXG4gICAgICAgICAgJ3RhaWx3aW5kLW1lcmdlJzogJ3RhaWx3aW5kTWVyZ2UnLFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICB9LFxuICByZXNvbHZlOiB7XG4gICAgLy8gVXNlIHNvdXJjZSBhbGlhcyBpbiBsb2NhbCBkZXYgZm9yIGZhc3RlciBpdGVyYXRpb24sIGF2b2lkIGFsaWFzIGR1cmluZyBidWlsZFxuICAgIC8vIHNvIFJvbGx1cCBjYW4gdHJlYXQgcGR5Zm9ybS9jb3JlIGFzIGV4dGVybmFsLlxuICAgIGFsaWFzOiBjb21tYW5kID09PSAnc2VydmUnXG4gICAgICA/IHtcbiAgICAgICAgICAncGR5Zm9ybS9jb3JlJzogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uL2NvcmUvc3JjJyksXG4gICAgICAgIH1cbiAgICAgIDoge30sXG4gIH0sXG59KSk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXFVLFNBQVMsb0JBQW9CO0FBQ2xXLE9BQU8sU0FBUztBQUNoQixPQUFPLFNBQVM7QUFDaEIsT0FBTyxVQUFVO0FBSGpCLElBQU0sbUNBQW1DO0FBS3pDLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsUUFBUSxPQUFPO0FBQUEsRUFDNUMsU0FBUyxDQUFDLElBQUksR0FBRyxJQUFJLEVBQUUsYUFBYSxLQUFLLENBQUMsQ0FBQztBQUFBLEVBQzNDLE9BQU87QUFBQSxJQUNMLEtBQUs7QUFBQSxNQUNILE9BQU8sS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUM3QyxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsU0FBUyxXQUFXLE9BQU8sUUFBUSxJQUFJO0FBQUEsSUFDL0Q7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVU7QUFBQSxRQUNSO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsTUFDRjtBQUFBLE1BQ0EsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFVBQ0wsZ0JBQWdCO0FBQUEsVUFDaEIsYUFBYTtBQUFBLFVBQ2IsbUJBQW1CO0FBQUEsVUFDbkIsNEJBQTRCO0FBQUEsVUFDNUIsTUFBTTtBQUFBLFVBQ04sa0JBQWtCO0FBQUEsUUFDcEI7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQTtBQUFBO0FBQUEsSUFHUCxPQUFPLFlBQVksVUFDZjtBQUFBLE1BQ0UsZ0JBQWdCLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsSUFDdkQsSUFDQSxDQUFDO0FBQUEsRUFDUDtBQUNGLEVBQUU7IiwKICAibmFtZXMiOiBbXQp9Cg==
