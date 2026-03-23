---
name: build-package-monorepo
description: 从 0 到 1 搭建一个多子包的 npm 包 monorepo 工程，包括工具链配置、包结构划分、构建、测试、代码规范等全流程最佳实践。适用于需要将核心逻辑与多个适配层（如不同框架、运行时等）解耦的库类项目。
---

# 从 0 到 1 搭建包类 Monorepo 项目

## 适用场景

- 发布一个拥有多个子包的 npm 包（如 core + 多个适配层）
- 核心逻辑与各适配层解耦，分别维护和发布
- 需要提供示例应用演示包的用法

## 技术栈选型

| 工具 | 用途 |
|---|---|
| **pnpm + pnpm-workspace** | Monorepo 包管理，高效磁盘复用 |
| **Turborepo** | 任务编排与增量缓存（build/dev/test/lint） |
| **TypeScript project references** | 跨包类型检查，无需先构建即可获得类型提示 |
| **tsup** | 纯 TS/JS 包的打包工具（也可用 Vite，视子包需求而定） |
| **Vitest** | 单元测试（兼容 jsdom） |
| **ESLint v9 + Prettier** | 统一代码规范（Flat Config） |

---

## 第一步：初始化工程根目录

```bash
mkdir my-package && cd my-package
git init
pnpm init
```

创建 `pnpm-workspace.yaml`，声明工作区：

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'   # 各子包
  - 'example/*'    # 示例应用
  - '.'            # 根包（发布入口）
```

---

## 第二步：规划目录结构

```
my-package/
├── packages/
│   ├── core/           # 核心逻辑，无额外运行时依赖
│   ├── subpackage1/    # 适配层 1（依赖 core）
│   └── subpackage2/    # 适配层 2（依赖 core）
├── example/
│   ├── demo1/          # 示例应用 1
│   └── demo2/          # 示例应用 2
├── eslint.config.mjs   # 根级 ESLint Flat Config
├── tsconfig.json       # 根级 TypeScript 项目引用（仅做引用聚合，不编译源码）
├── turbo.json          # Turborepo 任务配置
└── package.json        # 根 package.json（发布入口 + 全局命令）
```

**核心原则：`core` 包不引用任何子包；子包通过 `workspace:*` 依赖 `core`，且将 `core` 及所有宿主依赖声明为 `external`。**

---

## 第三步：配置根 package.json

```json
{
  "name": "my-package",
  "version": "1.0.0",
  "type": "module",
  "packageManager": "pnpm@9.0.0",
  "exports": {
    ".": {
      "types": "./packages/core/dist/index.d.ts",
      "import": "./packages/core/dist/index.js",
      "require": "./packages/core/dist/index.cjs"
    },
    "./subpackage1": {
      "types": "./packages/subpackage1/dist/index.d.ts",
      "import": "./packages/subpackage1/dist/index.js",
      "require": "./packages/subpackage1/dist/index.cjs"
    },
    "./subpackage2": {
      "types": "./packages/subpackage2/dist/index.d.ts",
      "import": "./packages/subpackage2/dist/index.js",
      "require": "./packages/subpackage2/dist/index.cjs"
    }
  },
  "typesVersions": {
    "*": {
      "subpackage1": ["./packages/subpackage1/dist/index.d.ts"],
      "subpackage2": ["./packages/subpackage2/dist/index.d.ts"]
    }
  },
  "files": [
    "README.md",
    "packages/core/dist/**",
    "packages/subpackage1/dist/**",
    "packages/subpackage2/dist/**"
  ],
  "scripts": {
    "build:all": "turbo run build",
    "dev:all": "turbo run dev",
    "test:all": "turbo run test",
    "lint:all": "turbo run lint",
    "dev:example:demo1": "pnpm --filter @example/demo1 dev",
    "dev:example:demo2": "pnpm --filter @example/demo2 dev"
  },
  "devDependencies": {
    "turbo": "latest",
    "typescript": "^5.0.0",
    "eslint": "^9.0.0",
    "prettier": "^3.0.0",
    "vitest": "^1.0.0"
  }
}
```

---

## 第四步：配置 Turborepo（turbo.json）

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "my-package-subpackage1#build": {
      "dependsOn": ["my-package-core#build"],
      "outputs": ["dist/**"]
    },
    "my-package-subpackage2#build": {
      "dependsOn": ["my-package-core#build"],
      "outputs": ["dist/**"]
    },
    "lint": {},
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"]
    }
  }
}
```

**关键点：**
- `"dependsOn": ["^build"]` 表示先递归构建所有上游依赖包。
- 用 `<package-name>#build` 显式声明子包对 core 的构建依赖，保证顺序正确。
- `dev` 设置 `cache: false` + `persistent: true`，使 watch 模式持续运行且不走缓存。

---

## 第五步：TypeScript Project References 配置

TypeScript project references 允许跨包共享类型，**无需先构建即可在 IDE 中获得完整类型提示**，是 monorepo 中类型管理的最佳实践。

### 规则一：根 tsconfig.json 只做引用聚合

根 `tsconfig.json` 不编译任何源码，只汇聚所有子包的引用，供 IDE 和 `tsc --build` 使用：

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "files": [],
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/subpackage1" },
    { "path": "./packages/subpackage2" }
  ],
  "exclude": ["node_modules", "dist"]
}
```

> `"files": []` 是必须的，表示根 tsconfig 本身不直接编译任何文件。

### 规则二：被引用包必须开启 composite

每个子包的 `tsconfig.json` 都要设置 `"composite": true`（或 `false` 若不需要被引用但也不应报错），并声明输出目录：

```json
{
  "compilerOptions": {
    "composite": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"]
}
```

> `composite: true` 要求同时设置 `declaration: true` 和 `outDir`，否则 tsc 会报错。

### 规则三：子包之间的引用要在 tsconfig 中声明

如果 `subpackage1` 依赖 `core`，除了在 `package.json` 里用 `workspace:*` 之外，还需要在 `subpackage1/tsconfig.json` 中声明 references：

```json
{
  "compilerOptions": { "..." : "..." },
  "references": [
    { "path": "../core" }
  ]
}
```

这样 IDE 可以直接跳转到 `core` 的源码，而不是 `dist/` 产物。

### 规则四：测试文件不纳入 composite 编译

`composite` 模式要求所有输入文件都有确定的输出，测试文件（`*.test.ts`）不应被打包进 `dist/`，所以在 `exclude` 中排除：

```json
"exclude": ["node_modules", "dist", "**/*.test.ts", "**/*.spec.ts"]
```

测试文件用单独的 `vitest.config.ts` 处理，不依赖 tsconfig 的 composite 编译。

### 规则五：构建工具（tsup/Vite）的 tsconfig 与 project references 分离

tsup/Vite 在构建时用的是自己的 `tsconfig`，与 TypeScript project references 的 tsc 编译是两条独立流程：
- **类型检查 / IDE 支持** → `tsc --build`（使用 composite + references）
- **产物打包** → `tsup` / `vite build`（直接读取 src，不走 tsc 编译链）

因此**构建脚本不需要也不应该用 `tsc --build`**，避免重复编译。

---

## 第六步：搭建 core 包

```
packages/core/
├── src/
│   ├── index.ts        # 统一导出
│   ├── types.ts        # 公共类型定义
│   └── utils.ts        # 工具函数
├── test/
│   └── utils.test.ts
├── tsup.config.ts
├── tsconfig.json       # composite: true
└── package.json
```

### core/package.json

```json
{
  "name": "my-package-core",
  "version": "1.0.0",
  "type": "module",
  "main": "./dist/index.cjs",
  "module": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js",
      "require": "./dist/index.cjs"
    }
  },
  "files": ["dist"],
  "scripts": {
    "build": "tsup",
    "dev": "tsup --watch",
    "test": "vitest run",
    "lint": "eslint src/**/*.ts --no-error-on-unmatched-pattern"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  }
}
```

### core/tsup.config.ts

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  clean: true,
  tsconfig: './tsconfig.json',
});
```

---

## 第七步：搭建子包（subpackage1 / subpackage2）

```
packages/subpackage1/
├── src/
│   └── index.ts        # 统一导出
├── test/
├── tsconfig.json       # composite: true + references core
├── vitest.config.ts
└── package.json
```

### subpackage1/package.json（关键部分）

```json
{
  "name": "my-package-subpackage1",
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts --clean --external my-package-core",
    "dev": "tsup src/index.ts --format cjs,esm --watch --dts --external my-package-core",
    "test": "vitest run"
  },
  "dependencies": {
    "my-package-core": "workspace:*"
  },
  "peerDependencies": {
    "some-peer-dep": "^x.0.0"
  }
}
```

> **关键点：** `my-package-core` 和所有 peerDependencies 都必须加 `--external`，不能打包进产物。

### subpackage1/tsconfig.json

```json
{
  "compilerOptions": {
    "composite": true,
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist", "**/*.test.ts"],
  "references": [
    { "path": "../core" }
  ]
}
```

### subpackage1/vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
  resolve: {
    // 测试时直接指向 core 源码，无需先 build core
    alias: {
      'my-package-core': path.resolve(__dirname, '../core/src'),
    },
  },
});
```

---

## 第八步：配置统一 ESLint（Flat Config）

```javascript
// eslint.config.mjs
import js from "@eslint/js";
import ts from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import globals from "globals";

export default ts.config(
  js.configs.recommended,
  ...ts.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.es2021 },
    },
    rules: {
      // 根据项目需要添加自定义规则
    },
  },
  prettierConfig,
  { ignores: ["**/dist/**", "**/node_modules/**"] }
);
```

> 根据子包使用的框架，可在对应的 `files` 范围内引入框架专属插件（如 `eslint-plugin-react`、`eslint-plugin-vue` 等）。

---

## 第九步：示例应用（example/demo1）

示例应用通过 `workspace:*` 引用本地包，和普通应用写法一样：

```json
{
  "name": "@example/demo1",
  "dependencies": {
    "my-package-core": "workspace:*",
    "my-package-subpackage1": "workspace:*"
  }
}
```

开发时 Vite 会读取 `dist/` 产物，因此需要先运行 `build:all` 或同时跑 `dev:all` 让各包处于 watch 模式。

---

## 完整工作流

```bash
# 1. 安装所有依赖
pnpm install

# 2. 全量构建（Turbo 按依赖顺序自动排序）
pnpm build:all

# 3. 启动开发模式（所有包同时 watch + 示例应用）
pnpm dev:all

# 4. 仅启动某个示例
pnpm dev:example:demo1

# 5. 运行所有测试
pnpm test:all

# 6. 运行 lint
pnpm lint:all
```

---

## 发布前 checklist

- [ ] 根 `package.json` 的 `exports` 字段完整（包含 `types` / `import` / `require`）
- [ ] 根 `package.json` 的 `files` 字段只包含 `dist/` 产物和 `README.md`
- [ ] 所有子包对宿主依赖使用 `peerDependencies`，不在 `dependencies`
- [ ] 所有 `--external` 配置正确，跨包依赖和 peer dep 不打包进产物
- [ ] 每个子包的 `tsconfig.json` 都设置了 `composite: true` 和正确的 `references`
- [ ] `pnpm build:all` 通过，`dist/` 产物包含 `.js`、`.cjs`、`.d.ts`
- [ ] `pnpm test:all` 全部通过

---

## 常见陷阱

| 问题 | 原因 | 解法 |
|---|---|---|
| 构建时找不到 core 类型 | subpackage 构建时 core 还没 build | turbo.json 显式声明 `<pkg>#build` 依赖 |
| 测试时 import core 失败 | 测试环境读 dist，但 core 未构建 | vitest.config 用 `alias` 直指 core 的 `src/` |
| IDE 跳转到 dist 而非源码 | tsconfig 未配置 project references | 子包 tsconfig 加 `references: [{ "path": "../core" }]` |
| tsc 报错 composite 缺少 declaration | composite 模式要求开启 declaration | 子包 tsconfig 补充 `declaration: true` 和 `outDir` |
| dev 模式修改 core 后示例不热更新 | example 依赖的是 dist 产物 | 用 `turbo dev` 同时跑所有包的 watch 模式 |
| 子包产物意外打包了 core 代码 | 忘记 --external | build 脚本对所有跨包依赖加 `--external` |
