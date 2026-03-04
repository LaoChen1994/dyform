<script setup lang="ts">
import type { FieldRendererProps } from '../fieldComponentMap';
import Textarea from '../components/Textarea.vue';

const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{ 'update:modelValue': [value: any] }>();
</script>

<template>
  <Textarea
    :id="fieldId"
    :placeholder="field.placeholder"
    :disabled="field.disabled"
    :name="field.name"
    :modelValue="modelValue ?? ''"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>
