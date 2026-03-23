# pdyform-vue

Vue 3 bindings for the high-performance, schema-driven dynamic form system [`pdyform`](https://github.com/LaoChen1994/pdyform).

## Features

- **Vue 3 Composition API**: First-class support for `setup` and Composition API patterns.
- **Reactive State**: Fully integrates with Vue's reactivity system for rapid updates.
- **Headless UI Friendly**: Ships with accessible Shadcn-Vue style components that you can easily customize.
- **Validation**: Full support for sync & async rules.

## Installation

```bash
pnpm add pdyform-core pdyform-vue
```

## Quick Start

```vue
<script setup lang="ts">
import { DynamicForm } from 'pdyform-vue';
import type { FormSchema } from 'pdyform-core';

const schema: FormSchema = {
  fields: [
    { 
      name: 'email', 
      label: 'Email', 
      type: 'email', 
      validations: [{ type: 'required', message: 'Required' }] 
    }
  ]
};

const handleSubmit = (values: any) => console.log(values);
</script>

<template>
  <DynamicForm :schema="schema" @submit="handleSubmit" />
</template>
```

For more documentation, visit the [main repository](https://github.com/LaoChen1994/pdyform).
