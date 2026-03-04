import type { FormField } from 'pdyform/core';
import type { Component } from 'vue';

import InputRenderer from './components/InputRenderer.vue';
import TextareaRenderer from './components/TextareaRenderer.vue';
import SelectRenderer from './components/SelectRenderer.vue';
import CheckboxRenderer from './components/CheckboxRenderer.vue';
import RadioRenderer from './components/RadioRenderer.vue';

/**
 * The props interface that every field renderer component must accept.
 * Custom field renderers must implement this interface.
 */
export interface FieldRendererProps {
  field: FormField;
  modelValue: any;
  fieldId: string;
}

/** Map from field type to a Vue component */
export type FieldComponentMap = Record<string, Component>;

/** The default built-in component map */
export const defaultComponentMap: FieldComponentMap = {
  text: InputRenderer,
  number: InputRenderer,
  password: InputRenderer,
  email: InputRenderer,
  date: InputRenderer,
  textarea: TextareaRenderer,
  select: SelectRenderer,
  checkbox: CheckboxRenderer,
  radio: RadioRenderer,
};
