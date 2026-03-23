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
    :disabled="typeof field.disabled === 'boolean' ? field.disabled : undefined"
    :name="field.name"
    :model-value="modelValue ?? ''"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>
