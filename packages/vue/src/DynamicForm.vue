<script setup lang="ts">
import { computed } from 'vue';
import type { FormSchema } from 'pdyform-core';
import { get, flattenElements } from 'pdyform-core';
import FormFieldRenderer from './FormFieldRenderer.vue';
import { useForm, type UseFormReturn } from './useForm';

const props = defineProps<{
  schema: FormSchema;
  className?: string;
  form?: UseFormReturn;
}>();

const emit = defineEmits(['submit']);

const internalForm = useForm({ schema: props.schema });
const form = props.form || internalForm;
const { engine, state: formState } = form;

const handleFieldChange = async (name: string, value: any) => {
  await engine.setFieldValue(name, value);
};

const handleFieldBlur = async (name: string) => {
  await engine.setFieldBlur(name);
};

const isFieldHidden = (field: any) => {
  return typeof field.hidden === 'function' ? field.hidden(formState.value.values) : !!field.hidden;
};

const getFieldWithDisabled = (field: any) => {
  const isDisabled = typeof field.disabled === 'function' ? field.disabled(formState.value.values) : !!field.disabled;
  const isValidating = formState.value.validatingFields.includes(field.name);
  return { ...field, disabled: isDisabled || isValidating };
};

const handleSubmit = async () => {
  const { hasError, values } = await form.validate();
  
  if (hasError) {
    const allFields = flattenElements(props.schema.elements || props.schema.fields || []);
    const firstErrorField = allFields.find(f => formState.value.errors[f.name]);
    if (firstErrorField) {
      const element = document.getElementById(`field-${firstErrorField.name}`);
      element?.focus();
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    return;
  }
  
  await emit('submit', values);
};

const isAnyFieldValidating = computed(() => formState.value.validatingFields.length > 0);
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
          v-if="!isFieldHidden(field)"
          :field="getFieldWithDisabled(field)"
          :model-value="get(formState.values, field.name)"
          :error="formState.errors[field.name]"
          @update:model-value="(val: any) => handleFieldChange(field.name, val)"
          @blur="handleFieldBlur(field.name)"
        />
      </template>
    </div>

    <button
      type="submit"
      :disabled="formState.isSubmitting || isAnyFieldValidating"
      class="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
    >
      {{ formState.isSubmitting ? 'Submitting...' : (isAnyFieldValidating ? 'Validating...' : (schema.submitButtonText || 'Submit')) }}
    </button>
  </form>
</template>
