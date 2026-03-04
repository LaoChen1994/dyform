<script setup lang="ts">
import type { FormField } from 'pdform/core';
import { computed } from 'vue';

const props = defineProps<{
  field: FormField;
  modelValue: any;
  error?: string;
}>();

const emit = defineEmits(['update:modelValue']);

const fieldId = computed(() => `field-${props.field.name}`);

const baseInputClasses = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

const handleUpdate = (val: any) => {
  emit('update:modelValue', val);
};

const handleCheckboxChange = (val: any, checked: boolean) => {
  const current = Array.isArray(props.modelValue) ? [...props.modelValue] : [];
  if (checked) {
    current.push(val);
  } else {
    const idx = current.indexOf(val);
    if (idx > -1) current.splice(idx, 1);
  }
  handleUpdate(current);
};
</script>

<template>
  <div :class="['space-y-2', field.className]">
    <label v-if="field.label" :for="fieldId" class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
      {{ field.label }}
    </label>

    <template v-if="field.type === 'textarea'">
      <textarea
        :id="fieldId"
        :class="[baseInputClasses, 'min-h-[80px]']"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
        :name="field.name"
        :value="modelValue"
        @input="(e: any) => handleUpdate(e.target.value)"
      />
    </template>

    <template v-else-if="field.type === 'select'">
      <select
        :id="fieldId"
        :class="baseInputClasses"
        :disabled="field.disabled"
        :name="field.name"
        :value="modelValue"
        @change="(e: any) => handleUpdate(e.target.value)"
      >
        <option value="" disabled>{{ field.placeholder || 'Select an option' }}</option>
        <option v-for="opt in field.options" :key="opt.value" :value="opt.value">
          {{ opt.label }}
        </option>
      </select>
    </template>

    <template v-else-if="field.type === 'checkbox'">
      <div class="flex flex-wrap gap-4">
        <label v-for="opt in field.options" :key="opt.value" class="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          <input
            type="checkbox"
            class="h-4 w-4 rounded border-primary text-primary focus:ring-primary"
            :disabled="field.disabled"
            :checked="Array.isArray(modelValue) && modelValue.includes(opt.value)"
            @change="(e: any) => handleCheckboxChange(opt.value, e.target.checked)"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </template>

    <template v-else-if="field.type === 'radio'">
      <div class="flex flex-wrap gap-4">
        <label v-for="opt in field.options" :key="opt.value" class="flex items-center space-x-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          <input
            type="radio"
            class="h-4 w-4 border-primary text-primary focus:ring-primary"
            :disabled="field.disabled"
            :name="field.name"
            :checked="modelValue === opt.value"
            @change="handleUpdate(opt.value)"
          />
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </template>

    <template v-else>
      <input
        :id="fieldId"
        :type="field.type"
        :class="baseInputClasses"
        :placeholder="field.placeholder"
        :disabled="field.disabled"
        :name="field.name"
        :value="modelValue"
        @input="(e: any) => handleUpdate(e.target.value)"
      />
    </template>

    <p v-if="field.description" class="text-sm text-muted-foreground">{{ field.description }}</p>
    <p v-if="error" class="text-sm font-medium text-destructive">{{ error }}</p>
  </div>
</template>
