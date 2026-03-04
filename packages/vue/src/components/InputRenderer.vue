<script setup lang="ts">
import type { FieldRendererProps } from '../fieldComponentMap';
import Input from '../components/Input.vue';

const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{ 'update:modelValue': [value: any] }>();
</script>

<template>
  <Input
    :id="fieldId"
    :type="field.type"
    :placeholder="field.placeholder"
    :disabled="field.disabled"
    :name="field.name"
    :modelValue="modelValue ?? ''"
    @update:modelValue="emit('update:modelValue', $event)"
  />
</template>
