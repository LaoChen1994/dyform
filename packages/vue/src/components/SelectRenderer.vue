<script setup lang="ts">
import type { FieldRendererProps } from '../fieldComponentMap';
import Select from '../components/Select.vue';
import SelectTrigger from '../components/SelectTrigger.vue';
import SelectContent from '../components/SelectContent.vue';
import SelectItem from '../components/SelectItem.vue';
import { SelectValue } from 'radix-vue';


const props = defineProps<FieldRendererProps>();
const emit = defineEmits<{ 'update:modelValue': [value: any] }>();
</script>

<template>
  <Select
    :disabled="typeof field.disabled === 'boolean' ? field.disabled : undefined"
    :name="field.name"
    :modelValue="modelValue != null ? String(modelValue) : ''"
    @update:modelValue="emit('update:modelValue', $event)"
  >
    <SelectTrigger :id="fieldId">
      <SelectValue :placeholder="field.placeholder || 'Select an option'" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem v-for="opt in field.options" :key="opt.value" :value="String(opt.value)">
        {{ opt.label }}
      </SelectItem>
    </SelectContent>
  </Select>
</template>
