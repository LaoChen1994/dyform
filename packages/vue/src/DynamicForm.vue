<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { FormSchema } from 'dyform/core';
import { validateField, getDefaultValues } from 'dyform/core';
import FormFieldRenderer from './FormFieldRenderer.vue';

const props = defineProps<{
  schema: FormSchema;
  className?: string;
}>();

const emit = defineEmits(['submit']);

const values = ref<Record<string, any>>({});
const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

onMounted(() => {
  values.value = getDefaultValues(props.schema.fields);
});

const handleFieldChange = (name: string, value: any) => {
  values.value[name] = value;
  
  const field = props.schema.fields.find(f => f.name === name);
  if (field) {
    const error = validateField(value, field);
    errors.value[name] = error || '';
  }
};

const handleSubmit = () => {
  isSubmitting.value = true;
  const newErrors: Record<string, string> = {};
  let hasError = false;

  props.schema.fields.forEach((field) => {
    const error = validateField(values.value[field.name], field);
    if (error) {
      newErrors[field.name] = error;
      hasError = true;
    }
  });

  errors.value = newErrors;

  if (!hasError) {
    emit('submit', { ...values.value });
  }
  isSubmitting.value = false;
};
</script>

<template>
  <form :class="['space-y-6', className]" @submit.prevent="handleSubmit">
    <div v-if="schema.title || schema.description" class="space-y-1">
      <h2 v-if="schema.title" class="text-2xl font-bold tracking-tight">{{ schema.title }}</h2>
      <p v-if="schema.description" class="text-muted-foreground">{{ schema.description }}</p>
    </div>

    <div class="space-y-4">
      <template v-for="field in schema.fields" :key="field.id">
        <FormFieldRenderer
          v-if="!field.hidden"
          :field="field"
          :model-value="values[field.name]"
          :error="errors[field.name]"
          @update:model-value="(val: any) => handleFieldChange(field.name, val)"
        />
      </template>
    </div>

    <button
      type="submit"
      :disabled="isSubmitting"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
    >
      {{ isSubmitting ? 'Submitting...' : (schema.submitButtonText || 'Submit') }}
    </button>
  </form>
</template>
