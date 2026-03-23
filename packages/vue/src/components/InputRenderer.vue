<script setup lang="ts">
import { normalizeFieldValue } from 'pdyform-core';
import type { FieldRendererProps } from '../fieldComponentMap';
import Input from '../components/Input.vue';

const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{ 
  'update:modelValue': [value: any];
  'blur': [event: FocusEvent];
}>();

const handleInput = (nextValue: any) => {
  emit('update:modelValue', normalizeFieldValue(props.field, nextValue));
};
</script>

<template>
  <Input
    :id="fieldId"
    :type="field.type"
    :placeholder="field.placeholder"
    :disabled="typeof field.disabled === 'boolean' ? field.disabled : undefined"
    :name="field.name"
    :model-value="modelValue ?? ''"
    @update:model-value="handleInput"
    @blur="emit('blur', $event)"
  />
</template>

