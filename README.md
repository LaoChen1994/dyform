# pdyform

[![npm version](https://badge.fury.io/js/pdyform.svg)](https://badge.fury.io/js/pdyform)
[![Tests](https://img.shields.io/badge/tests-6%20passed%20(100%25)-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [中文说明](#中文说明)

---

## English

A high-performance, schema-driven dynamic form system with **React** and **Vue** support. It provides a framework-agnostic core logic for schema parsing and validation, allowing seamless integration across different frontend frameworks while maintaining a consistent configuration.

### 🌟 Features

- **Schema-Driven**: Define your forms using a simple and intuitive JSON/JS schema.
- **Framework Agnostic Core**: Core logic is entirely framework-free, making it extremely lightweight.
- **React & Vue Support**: Out-of-the-box UI components for React (built on Shadcn UI) and Vue (built on Shadcn-vue).
- **High Performance**: Optimized rendering to prevent unnecessary re-renders on complex forms.
- **100% Test Coverage**: Core logic and UI components are fully unit-tested with a 100% pass rate.

### 📦 Packages

The monorepo contains the following packages:

- `pdyform-core`: Framework-agnostic logic, utilities, and schema parser.
- `pdyform-react`: React components based on Shadcn UI.
- `pdyform-vue`: Vue components based on Shadcn-vue.

### 🚀 Installation

```bash
npm install pdyform
# or
pnpm add pdyform
# or
yarn add pdyform
```

### 💻 Usage

This package provides a unified entry point. You can import framework-specific components directly from the main package:

#### React

```tsx
import React from 'react';
import { DynamicForm } from 'pdyform/react';
import type { FormSchema } from 'pdyform/core';

const schema: FormSchema = {
  fields: [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text', required: true, rules: { pattern: '\\S+@\\S+\\.\\S+' } }
  ]
};

export default function App() {
  return <DynamicForm schema={schema} onSubmit={console.log} />;
}
```

#### Vue

```vue
<script setup lang="ts">
import { DynamicForm } from 'pdyform/vue';
import type { FormSchema } from 'pdyform/core';

const schema: FormSchema = {
  fields: [
    { name: 'username', label: 'Username', type: 'text', required: true },
    { name: 'email', label: 'Email', type: 'text', required: true, rules: { pattern: '\\S+@\\S+\\.\\S+' } }
  ]
};

const handleSubmit = (data: any) => console.log(data);
</script>

<template>
  <DynamicForm :schema="schema" @submit="handleSubmit" />
</template>
```

---

## 中文说明

一个高性能、基于 Schema 驱动的动态表单系统，同时支持 **React** 和 **Vue**。它提供了一个与框架无关的核心逻辑层用于 Schema 解析和表单校验，允许在不同的前端框架中无缝集成并保持一致的配置体验。

### 🌟 特性

- **Schema 驱动**: 使用简单直观的 JSON/JS 对象定义你的表单。
- **框架无关核心**: 核心逻辑完全独立于任何 UI 框架，极其轻量化。
- **支持 React & Vue**: 开箱即用的 UI 组件，React 版本基于 Shadcn UI，Vue 版本基于 Shadcn-vue。
- **高性能**: 渲染优化机制，避免复杂表单场景下的无效重渲染。
- **可靠的测试覆盖率**: 核心逻辑与 UI 层均经过严格的单元测试，用例通过率 100%。

### 📦 包结构

此 Monorepo 包含以下几个核心子包：

- `pdyform-core`: 与框架无关的核心表单逻辑、校验工具和 Schema 解析器。
- `pdyform-react`: 基于 Shadcn UI 的 React 动态表单组件。
- `pdyform-vue`: 基于 Shadcn-vue 的 Vue 动态表单组件。

### 🚀 安装

```bash
npm install pdyform
# 或
pnpm add pdyform
# 或
yarn add pdyform
```

### 💻 基本使用

`pdyform` 提供了统一的导出入口。你可以直接从主包中按需引入对应框架的组件和核心类型：

#### React 示例

```tsx
import React from 'react';
import { DynamicForm } from 'pdyform/react';
import type { FormSchema } from 'pdyform/core';

const schema: FormSchema = {
  fields: [
    { name: 'username', label: '用户名', type: 'text', required: true },
    { name: 'email', label: '邮箱', type: 'text', required: true, rules: { pattern: '\\S+@\\S+\\.\\S+' } }
  ]
};

export default function App() {
  return <DynamicForm schema={schema} onSubmit={console.log} />;
}
```

#### Vue 示例

```vue
<script setup lang="ts">
import { DynamicForm } from 'pdyform/vue';
import type { FormSchema } from 'pdyform/core';

const schema: FormSchema = {
  fields: [
    { name: 'username', label: '用户名', type: 'text', required: true },
    { name: 'email', label: '邮箱', type: 'text', required: true, rules: { pattern: '\\S+@\\S+\\.\\S+' } }
  ]
};

const handleSubmit = (data: any) => console.log(data);
</script>

<template>
  <DynamicForm :schema="schema" @submit="handleSubmit" />
</template>
```

---

## 🛠️ Development / 本地开发

```bash
# Install dependencies / 安装依赖
pnpm install

# Build all packages / 编译所有包
pnpm run build:all

# Run all tests / 运行所有单元测试
pnpm run test:all
```
