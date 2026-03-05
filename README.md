# pdyform

[![npm version](https://badge.fury.io/js/pdyform.svg)](https://badge.fury.io/js/pdyform)
[![Tests](https://img.shields.io/badge/tests-27%20passed%20(100%25)-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[English](#english) | [中文说明](#中文说明)

---

## English

A high-performance, schema-driven dynamic form system with **React** and **Vue** support. It provides a framework-agnostic core logic for schema parsing and validation, allowing seamless integration across different frontend frameworks while maintaining a consistent configuration.

### 🌟 Features

- **Schema-Driven**: Define your forms using a simple and intuitive JSON/JS schema.
- **Framework Agnostic Core**: Core logic is entirely framework-free, making it extremely lightweight and portable.
- **Conditional Logic**: Supports dynamic `hidden` and `disabled` states based on form values (supports both boolean and functions).
- **React & Vue Support**: Out-of-the-box UI components built on top of modern UI libraries (Radix UI / Shadcn).
- **Type Safety**: Built with TypeScript for excellent developer experience and catch errors early.
- **High Performance**: Optimized rendering using store-based state management (Zustand) to minimize re-renders.

### 📦 Packages

The monorepo contains the following packages:

- `pdyform-core`: Framework-agnostic logic, validation utilities, and schema parser.
- `pdyform-react`: React components and hooks (`useForm`).
- `pdyform-vue`: Vue components and composables (`useForm`).

### 🚀 Installation

```bash
# Install core and framework-specific package
pnpm add pdyform-core pdyform-react # For React
# or
pnpm add pdyform-core pdyform-vue   # For Vue
```

### 💻 Usage

#### React

```tsx
import React from 'react';
import { DynamicForm } from 'pdyform-react';
import type { FormSchema } from 'pdyform-core';

const schema: FormSchema = {
  title: "Login",
  fields: [
    { 
      name: 'username', 
      label: 'Username', 
      type: 'text', 
      validations: [{ type: 'required', message: 'Username is required' }] 
    },
    { 
      name: 'isAdmin', 
      label: 'Is Admin?', 
      type: 'switch' 
    },
    { 
      name: 'adminToken', 
      label: 'Admin Token', 
      type: 'password',
      // Conditional logic: only show if isAdmin is true
      hidden: (values) => !values.isAdmin 
    }
  ]
};

export default function App() {
  return <DynamicForm schema={schema} onSubmit={(values) => console.log(values)} />;
}
```

#### Vue

```vue
<script setup lang="ts">
import { DynamicForm } from 'pdyform-vue';
import type { FormSchema } from 'pdyform-core';

const schema: FormSchema = {
  title: "Profile",
  fields: [
    { 
      name: 'email', 
      label: 'Email', 
      type: 'email', 
      validations: [
        { type: 'required', message: 'Email is required' },
        { type: 'email', message: 'Invalid email format' }
      ] 
    }
  ]
};

const handleSubmit = (values: any) => console.log(values);
</script>

<template>
  <DynamicForm :schema="schema" @submit="handleSubmit" />
</template>
```

---

## 中文说明

一个高性能、基于 Schema 驱动的动态表单系统，同时支持 **React** 和 **Vue**。它提供了一个与框架无关的核心逻辑层用于 Schema 解析和表单校验，允许在不同的框架中无缝集成并保持一致的配置体验。

### 🌟 特性

- **Schema 驱动**: 使用简单直观的 JSON/JS 对象定义你的表单。
- **框架无关核心**: 核心逻辑完全独立于 UI 框架，极其轻量且易于移植。
- **联动逻辑**: 支持基于表单实时数值动态控制字段的 `hidden`（隐藏）和 `disabled`（禁用）状态（支持布尔值或函数）。
- **支持 React & Vue**: 提供基于现代 UI 库（Radix UI / Shadcn）的开箱即用组件。
- **类型安全**: 全量 TypeScript 编写，提供极佳的开发体验。
- **高性能**: 基于 Zustand 状态管理库优化渲染逻辑，最小化不必要的组件重绘。

### 📦 包结构

- `pdyform-core`: 与框架无关的核心表单逻辑、校验工具和 Schema 解析器。
- `pdyform-react`: 基于 React 的动态表单组件与 `useForm` Hook。
- `pdyform-vue`: 基于 Vue 的动态表单组件与 `useForm` 组合式 API。

### 🚀 安装

```bash
# 安装核心包和对应的框架包
pnpm add pdyform-core pdyform-react # React 项目
# 或
pnpm add pdyform-core pdyform-vue   # Vue 项目
```

### 💻 基本使用

#### React 示例

```tsx
import React from 'react';
import { DynamicForm } from 'pdyform-react';
import type { FormSchema } from 'pdyform-core';

const schema: FormSchema = {
  fields: [
    { 
      name: 'username', 
      label: '用户名', 
      type: 'text', 
      validations: [{ type: 'required', message: '请输入用户名' }] 
    },
    {
      name: 'type',
      label: '用户类型',
      type: 'select',
      options: [
        { label: '个人', value: 'personal' },
        { label: '企业', value: 'enterprise' }
      ]
    },
    {
      name: 'companyName',
      label: '公司名称',
      type: 'text',
      // 联动逻辑：仅当用户类型为 'enterprise' 时显示
      hidden: (values) => values.type !== 'enterprise'
    }
  ]
};

export default function App() {
  return <DynamicForm schema={schema} onSubmit={(values) => console.log(values)} />;
}
```

#### Vue 示例

```vue
<script setup lang="ts">
import { DynamicForm } from 'pdyform-vue';
import type { FormSchema } from 'pdyform-core';

const schema: FormSchema = {
  fields: [
    { 
      name: 'nickname', 
      label: '昵称', 
      type: 'text', 
      validations: [{ type: 'required', message: '昵称不能为空' }] 
    }
  ]
};

const handleSubmit = (values: any) => console.log(values);
</script>

<template>
  <DynamicForm :schema="schema" @submit="handleSubmit" />
</template>
```

---

## 🛠️ Development / 本地开发

```bash
# 安装依赖
pnpm install

# 编译所有包
pnpm run build:all

# 运行所有单元测试
pnpm run test:all
```

## Examples / 示例工程

项目内置了 `example/` 目录用于开发调试，支持实时编辑 Schema 并查看渲染效果：

- `pnpm run dev:example`：同时启动 React 和 Vue 的 Demo 预览。
- `pnpm run dev:example:react`：仅启动 React Demo。
- `pnpm run dev:example:vue`：仅启动 Vue Demo。
