<script setup lang="ts">
import type { FormField } from 'pdyform-core';
import type { Component } from 'vue';
import { computed } from 'vue';
import { defaultComponentMap, type FieldComponentMap } from './fieldComponentMap';
import Label from './components/Label.vue';
import InputRenderer from './components/InputRenderer.vue';

const props = defineProps<{
  field: FormField;
  modelValue: any;
  error?: string;
  /**
   * Custom component map.
   * Entries here are merged with the default map, so you can override
   * specific types or add entirely new ones.
   *
   * @example
   * ```ts
   * import { defaultComponentMap } from 'pdyform-vue';
   * const myMap = {
   *   ...defaultComponentMap,
   *   text: MyCustomInput,       // overrides built-in text input
   *   rating: StarRatingField,   // adds a new field type
   * };
   * ```
   */
  componentMap?: FieldComponentMap;
}>();

const emit = defineEmits(['update:modelValue', 'blur']);

const fieldId = computed(() => `field-${props.field.name}`);
const descriptionId = computed(() => `${fieldId.value}-description`);
const errorId = computed(() => `${fieldId.value}-error`);

const isRequired = computed(() => props.field.validations?.some((v: any) => v.type === 'required'));

const ariaDescribedBy = computed(() => {
  const ids = [];
  if (props.field.description) ids.push(descriptionId.value);
  if (props.error) ids.push(errorId.value);
  return ids.length > 0 ? ids.join(' ') : undefined;
});

// Merge external map over defaults — external wins
const resolvedMap = computed<FieldComponentMap>(() =>
  props.componentMap
    ? { ...defaultComponentMap, ...props.componentMap }
    : defaultComponentMap
);

// Resolve a component or fall back to InputRenderer
const ResolvedFieldComponent = computed<Component>(
  () => resolvedMap.value[props.field.type] ?? InputRenderer
);
</script>

<template>
  <div :class="['space-y-2', field.className]">
    <Label v-if="field.label" :for="fieldId" :class="isRequired ? 'flex items-center gap-1' : ''">
      {{ field.label }}
      <span v-if="isRequired" class="text-destructive">*</span>
    </Label>

    <!-- All field rendering is delegated to the resolved component -->
    <component
      :is="ResolvedFieldComponent"
      :field="field"
      :field-id="fieldId"
      :model-value="modelValue"
      :aria-invalid="!!error"
      :aria-required="isRequired"
      :aria-describedby="ariaDescribedBy"
      @update:model-value="emit('update:modelValue', $event)"
      @blur="emit('blur', $event)"
    />

    <p v-if="field.description" :id="descriptionId" class="text-[0.8rem] text-muted-foreground">
      {{ field.description }}
    </p>
    <p v-if="error" :id="errorId" class="text-[0.8rem] font-medium text-destructive">
      {{ error }}
    </p>
  </div>
</template>

