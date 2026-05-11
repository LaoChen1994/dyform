<script setup lang="ts">
import { ref } from 'vue';
import { DynamicForm } from 'pdyform-vue';
import type { FormSchema } from 'pdyform-core';
import { defaultSchema } from '../../shared/defaultSchema';

const schemaText = ref(JSON.stringify(defaultSchema, null, 2));
const schema = ref<FormSchema>(defaultSchema);
const parseError = ref('');
const submitResult = ref('');

const handleSchemaChange = (nextText: string) => {
  schemaText.value = nextText;

  try {
    const parsed = JSON.parse(nextText) as FormSchema;
    if (!parsed || !Array.isArray(parsed.fields)) {
      parseError.value = 'Schema must contain a fields array.';
      return;
    }
    schema.value = parsed;
    parseError.value = '';
  } catch (error) {
    parseError.value = error instanceof Error ? error.message : 'Unknown parsing error';
  }
};

const handleSubmit = (values: Record<string, unknown>) => {
  submitResult.value = JSON.stringify(values, null, 2);
};
</script>

<template>
  <main class="page">
    <header>
      <h1>pdyform Vue Demo</h1>
      <p>Edit schema JSON on the left and validate render/submit behavior on the right.</p>
    </header>

    <section class="grid">
      <div class="panel">
        <h2>Schema Editor</h2>
        <textarea
          :value="schemaText"
          spellcheck="false"
          @input="(event) => handleSchemaChange((event.target as HTMLTextAreaElement).value)"
        />
        <p v-if="parseError" class="error">JSON Parse Error: {{ parseError }}</p>
        <p v-else class="ok">Schema is valid.</p>
      </div>

      <div class="panel">
        <h2>Rendered Form</h2>
        <DynamicForm :schema="schema" @submit="handleSubmit" />

        <h3>Submit Payload</h3>
        <pre>{{ submitResult || 'Submit the form to inspect values.' }}</pre>
      </div>
    </section>
  </main>
</template>
