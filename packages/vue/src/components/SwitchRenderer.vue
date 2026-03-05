<script setup lang="ts">
import type { FormField } from 'pdyform-core';
import Switch from './Switch.vue';

defineProps<{
  field: FormField;
  modelValue: boolean;
  fieldId: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  ariaDescribedby?: string;
}>();

const emit = defineEmits(['update:modelValue', 'blur']);
</script>

<template>
  <div class="flex items-center space-x-2">
    <Switch
      :id="fieldId"
      :checked="modelValue"
      :disabled="typeof field.disabled === 'boolean' ? field.disabled : undefined"
      :aria-invalid="ariaInvalid"
      :aria-required="ariaRequired"
      :aria-describedby="ariaDescribedby"
      @update:checked="(val) => emit('update:modelValue', val)"
    />
  </div>
</template>
