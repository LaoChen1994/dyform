<script setup lang="ts">
import type { FieldRendererProps } from '../fieldComponentMap';
import Checkbox from '../components/Checkbox.vue';
import Label from '../components/Label.vue';

const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{ 'update:modelValue': [value: any] }>();

const handleChange = (optValue: any, checked: boolean) => {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  if (checked) {
    current.push(optValue);
  } else {
    const idx = current.indexOf(optValue);
    if (idx > -1) current.splice(idx, 1);
  }
  emit('update:modelValue', current);
};
</script>

<template>
  <div class="flex flex-wrap gap-4">
    <div v-for="opt in field.options" :key="opt.value" class="flex items-center space-x-2">
      <Checkbox
        :id="`checkbox-${field.name}-${opt.value}`"
        :disabled="typeof field.disabled === 'boolean' ? field.disabled : undefined"
        :checked="Array.isArray(modelValue) && modelValue.includes(opt.value)"
        @update:checked="(checked) => handleChange(opt.value, !!checked)"
      />
      <Label :for="`checkbox-${field.name}-${opt.value}`" class="font-normal">
        {{ opt.label }}
      </Label>
    </div>
  </div>
</template>
