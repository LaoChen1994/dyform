<script setup lang="ts">
import type { FieldRendererProps } from '../fieldComponentMap';
import RadioGroup from '../components/RadioGroup.vue';
import RadioGroupItem from '../components/RadioGroupItem.vue';
import Label from '../components/Label.vue';

const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{ 'update:modelValue': [value: any] }>();
</script>

<template>
  <RadioGroup
    class="flex flex-wrap gap-4"
    :disabled="typeof field.disabled === 'boolean' ? field.disabled : undefined"
    :name="field.name"
    :model-value="modelValue != null ? String(modelValue) : ''"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <div v-for="opt in field.options" :key="opt.value" class="flex items-center space-x-2">
      <RadioGroupItem :id="`radio-${field.name}-${opt.value}`" :value="String(opt.value)" />
      <Label :for="`radio-${field.name}-${opt.value}`" class="font-normal">{{ opt.label }}</Label>
    </div>
  </RadioGroup>
</template>
