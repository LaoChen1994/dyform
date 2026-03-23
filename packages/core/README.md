# pdyform-core

The headless, framework-agnostic data engine behind `pdyform`. 

This package contains the raw data structures, schema validation logic, and a fully standalone Pub-Sub `VanillaStore` that manages state natively. It operates entirely without React, Vue, or Zustand, providing an ultra-lightweight layer for complex form logic you can use anywhere.

## 📦 Installation

```bash
pnpm add pdyform-core
```

## 🚀 Quick Start (Vanilla JS)

Using the newly established `FormEngine`, you can initialize a complete dynamic form lifecycle inside pure JavaScript, Node.js, Web Components or any UI library!

```typescript
import { createFormEngine, FormSchema } from 'pdyform-core';

// 1. Define your schema
const schema: FormSchema = {
  fields: [
    { 
      name: 'username', 
      label: 'Username', 
      type: 'text', 
      validations: [{ type: 'required', message: 'Required!' }] 
    }
  ]
};

// 2. Initialize the engine
const engine = createFormEngine(schema.fields, schema.resolver, schema.errorMessages);

// 3. Subscribe to the pure state store
const unsubscribe = engine.store.subscribe((state) => {
  console.log('Form State Updated:', state);
});

// 4. Run commands against the engine
engine.setFieldValue('username', 'Alice');
engine.setFieldBlur('username'); // triggers validation for text fields

// Get the current snapshot immediately
const currentState = engine.store.getState();
console.log(currentState.values.username); // "Alice"

// Cleanup subscription when your component unmounts
unsubscribe();
```

## 🏗 Architecture 

The core has two major boundaries:

1. **`createStore` (Vanilla Store)**: A pure `<T>` generic State Machine. Replaces Zustand natively giving us less overhead and 0 side effects. Exposes `getState`, `setState`, and `subscribe`.
2. **`createFormEngine` (Form Manager)**: Injects the domain knowledge (like running Async validations, parsing Schema structures, normalizing values) on top of the generic store, giving you methods like `setFieldValue` and `runSubmitValidation`.

This division allows framework wrappers (like `pdyform-react`) to easily hook straight to the sub-state tracking (`store.subscribe`) while retaining simple API calls on the `.engine`.
