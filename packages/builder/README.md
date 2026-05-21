<div align="center">
  <h1>🛠️ pdyform-builder</h1>
  <p><strong>A powerful, out-of-the-box visual drag-and-drop form builder for React.</strong></p>

  <p>
    <a href="https://www.npmjs.com/package/pdyform-builder"><img src="https://img.shields.io/npm/v/pdyform-builder.svg?style=flat-square" alt="NPM Version" /></a>
    <a href="https://www.npmjs.com/package/pdyform-builder"><img src="https://img.shields.io/npm/dm/pdyform-builder.svg?style=flat-square" alt="NPM Downloads" /></a>
    <img src="https://img.shields.io/badge/React-18%2B-61DAFB.svg?style=flat-square&logo=react" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-Ready-3178C6.svg?style=flat-square&logo=typescript" alt="TypeScript" />
  </p>
</div>

---

## ⚡ Live Demo / 在线体验
Experience the visual builder live in your browser:
👉 **[https://LaoChen1994.github.io/pdyform/](https://LaoChen1994.github.io/pdyform/)**
*(Try dragging layout containers, configuring rules dynamically, and exporting schemas.)*

---

`pdyform-builder` provides a complete visual editing experience for generating complex form schemas. It comes with a beautiful three-pane layout (Component Palette, Canvas, Property Inspector), making it effortless to integrate a professional form builder into your application.

## ✨ Features

- 🎨 **Visual Drag & Drop**: Powered by `@dnd-kit` for a smooth, accessible, and robust drag-and-drop experience.
- 📦 **Out of the box**: Ready-to-use three-pane layout without complex configuration.
- 🔄 **Real-time Preview**: Instant live preview of the generated `FormSchema` and UI.
- ⚡ **High Performance**: State management driven by `zustand` and `immer` for optimal React rendering.
- 🛡️ **Strict Type Safety**: Fully written in TypeScript, ensuring robust integration with `pdyform-core`.
- 🧩 **Framework Agnostic Schema**: Generates a standard JSON schema that can be rendered using `pdyform-react` or any other adapter.

## 📦 Installation

```bash
# Using npm
npm install pdyform-builder pdyform-core pdyform-react

# Using pnpm
pnpm add pdyform-builder pdyform-core pdyform-react

# Using yarn
yarn add pdyform-builder pdyform-core pdyform-react
```

> **Note:** `pdyform-builder` requires `react` and `react-dom` as peer dependencies.

## 🚀 Quick Start

Drop the `FormBuilder` component into your React application to get a complete, working form builder interface instantly.

```tsx
import React from 'react';
import { FormBuilder } from 'pdyform-builder';

// Optional: Import CSS if the package provides compiled styles
// import 'pdyform-builder/dist/index.css'; 

export default function App() {
  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <FormBuilder />
    </div>
  );
}
```

## 🏗️ Architecture

The builder uses a clean, intuitive layout by default:
1. **Left Panel (Palette)**: A list of available form fields and layout elements (Input, Select, Grids, etc.).
2. **Center Panel (Canvas)**: The interactive drag-and-drop area where users assemble the form.
3. **Right Panel (Inspector)**: Property configuration for the currently selected field (Validation rules, default values, placeholders, etc.).

## 📖 Related Packages

This package is part of the `pdyform` ecosystem:
- [`pdyform-core`](https://www.npmjs.com/package/pdyform-core): The core logic, types, and schema definition.
- [`pdyform-react`](https://www.npmjs.com/package/pdyform-react): The React renderer that converts schemas into working forms.

## 📄 License

MIT © Pidan
