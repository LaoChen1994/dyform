---
name: github-actions-ci-release
description: 从零到一配置现代化前端开源库的 GitHub Actions 持续集成与自动化发版（Changesets）全套解决方案，包含 NPM_TOKEN 与机器人权限限制的避坑指南。
---

# GitHub Actions CI & Release 最佳实践

本技能文档总结了在项目重构与配置基础设施时，一套经过验证、无痛运转的 GitHub Actions 自动化发版解决方案，并着重记录了诸多常见踩坑点及根因。

## 1. 前置代码质量保障 (Husky + Commitlint)

为了防止将不规范或无法通过单测的代码合入主干，强烈建议引入 Husky 拦截器。
在 `package.json` 中的 `scripts` 添加入口：
```json
"prepare": "husky"
```

**提交规范检查 (`.husky/commit-msg`)**：
执行 `npx --no -- commitlint --edit ${1}` 来严格要求类似 `feat: xxx`, `chore: xxx` 的 Conventional Commits 格式。

**发版前校验 (`.husky/pre-commit`)**：
在 `.husky/pre-commit` 脚本中挂载 `pnpm test:all` 和 `pnpm lint:all`。
这是避免在远端 CI 才发现格式或单测错误的第一把防线。

## 2. 持续集成审查 (`.github/workflows/ci.yml`)

当代码推送或 PR 给主干 `master`（或 `main`）时，该文件会被激活。它主要用于快速发现构建环境的各种兼容性问题。

```yaml
name: CI
on:
  push:
    branches:
      - master # 需严格与本地主干分支名称一致
  pull_request:

jobs:
  build_lint_test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
      - name: Use Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - name: Install dependencies
        run: pnpm install
      - name: Lint
        run: pnpm lint:all
      - name: Build
        run: pnpm build:all
      - name: Test
        run: pnpm test:all
```

## 3. Changeset 自动化发布流水线 (`.github/workflows/release.yml`)

核心灵魂是采用 `@changesets/action`，它会监控每次合入的变化，自动识别版本增量、生成发版 PR 或在被人工许可后自动发包并打 tag。

**核心踩坑集锦与正确解法**：

1. **GitHub 机器人无法创建 tag 退出的 `403 Permission denied` 问题**：
   GitHub 官方更新后，默认的 GitHub Action bot 权限只有"Read（只读）"。我们在跑完 NPM 后，它反手试图往 GitHub 推签（tag），会瞬间崩溃撤回。
   **解法**：在 `workflow/job` 顶部显式开放 `contents: write` 写入权限！
   
2. **`baseBranch` 不一致导致无法触发或差异比对错误**：
   如果你本地默认是 `master` 分支，但 `.changeset/config.json` 里写的 `baseBranch: main`，会严重误导比对算法。请务必保证其与 GitHub 上的主干名 1:1 对齐。

3. **包访问权限的硬阻拦 (`publishConfig.access`)**：
   即便是公有非 Scope 包（无 `@name/` 前缀），建议在各子包 `package.json` 里也硬编码显式添加：
   ```json
   "publishConfig": {
     "access": "public"
   }
   ```
   可防患所有因权限探测缺失引起的意外 NPM 校验退回。

4. **发版前先构建产物 (`release` scripts 的坑)**：
   Changesets 在远端跑时默认执行 `pnpm release`，如果脚本里只写了 `"release": "changeset publish"`，会导致它没编译就发包，最后因为找不到 `/dist` 退回。
   **正确解法**：
   必须改为 `"release": "pnpm build:all && changeset publish"`。

5. **极其致命的 `NPM_TOKEN` Authentication 验证错误**：
   如果 `pnpm pnpm/action-setup` 失败出退出码 1，在 `Release` Job 里，99% 因为没有合法 Token 或者误触 2FA 二次防护。
   **正确解法**：从 npmjs.com 后台生成的 Token 类型**必须是 Automation (自动操作)**。如果选了 Classic 等标准 Token，它依然会要求你在行动端去接受手机验证码交互，从而卡死机器人进而导致发版崩断。

```yaml
name: Release

on:
  push:
    branches:
      - master # 需对齐根分支名

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    permissions:
      contents: write # 必须开放以防止打 tag 失败的 403
      pull-requests: write 

    steps:
      - name: Checkout Repo
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js 20
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install pnpm
        uses: pnpm/action-setup@v3
        with:
          version: 9
          run_install: false

      - name: Get pnpm store directory
        id: pnpm-cache
        shell: bash
        run: |
          echo "STORE_PATH=$(pnpm store path)" >> $GITHUB_OUTPUT

      - name: Setup pnpm cache
        uses: actions/cache@v4
        with:
          path: ${{ steps.pnpm-cache.outputs.STORE_PATH }}
          key: ${{ runner.os }}-pnpm-store-${{ hashFiles('**/pnpm-lock.yaml') }}
          restore-keys: |
            ${{ runner.os }}-pnpm-store-

      - name: Install dependencies
        run: pnpm install

      - name: Create Release Pull Request or Publish
        id: changesets
        uses: changesets/action@v1
        with:
          publish: pnpm release
          version: pnpm version-packages
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          NPM_TOKEN: ${{ secrets.NPM_TOKEN }} # 必须使用 NPM_TOKEN (且确保类型为 Automation)
```
