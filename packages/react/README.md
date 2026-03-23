# pdyform-react

React bindings for the high-performance, schema-driven dynamic form system [`pdyform`](https://github.com/LaoChen1994/pdyform).

## Features

- **Seamless React Integration**: Built closely around React hooks and context.
- **Fine-Grained Subscriptions**: Powered by `useSyncExternalStore` for zero-unnecessary re-renders.
- **Headless UI Friendly**: Ships with accessible Shadcn-style components that you can easily customize.
- **Validation**: Full support for sync & async rules.

## Installation

```bash
pnpm add pdyform-core pdyform-react
```

## Quick Start

```tsx
import React from 'react';
import { DynamicForm } from 'pdyform-react';
import type { FormSchema } from 'pdyform-core';

const schema: FormSchema = {
  fields: [
    { 
      name: 'username', 
      label: 'Username', 
      type: 'text', 
      validations: [{ type: 'required', message: 'Required' }] 
    }
  ]
};

export default function App() {
  return (
    <DynamicForm 
      schema={schema} 
      onSubmit={(values) => console.log(values)} 
    />
  );
}
```

For more documentation, visit the [main repository](https://github.com/LaoChen1994/pdyform).
