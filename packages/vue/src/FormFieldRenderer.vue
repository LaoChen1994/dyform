<script setup lang="ts">
import type { FormField } from 'pdyform/core';
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

const emit = defineEmits(['update:modelValue']);

const fieldId = computed(() => `field-${props.field.name}`);

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
    <Label v-if="field.label" :for="fieldId">
      {{ field.label }}
    </Label>

    <!-- All field rendering is delegated to the resolved component -->
    <component
      :is="ResolvedFieldComponent"
      :field="field"
      :fieldId="fieldId"
      :modelValue="modelValue"
      @update:modelValue="emit('update:modelValue', $event)"
    />

    <p v-if="field.description" class="text-[0.8rem] text-muted-foreground">
      {{ field.description }}
    </p>
    <p v-if="error" class="text-[0.8rem] font-medium text-destructive">
      {{ error }}
    </p>
  </div>
</template>
