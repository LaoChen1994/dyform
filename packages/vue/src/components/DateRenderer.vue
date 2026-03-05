<script setup lang="ts">
import type { FormField } from 'pdyform-core';
import Input from './Input.vue';

defineProps<{
  field: FormField;
  modelValue: string;
  fieldId: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  ariaDescribedby?: string;
}>();

const emit = defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <Input
    :id="fieldId"
    type="date"
    :modelValue="modelValue"
    :placeholder="field.placeholder"
    :disabled="typeof field.disabled === 'boolean' ? field.disabled : undefined"
    :name="field.name"
    :aria-invalid="ariaInvalid"
    :aria-required="ariaRequired"
    :aria-describedby="ariaDescribedby"
    @update:modelValue="emit('update:modelValue', $event)"
    @blur="emit('blur', $event)"
  />
</template>
