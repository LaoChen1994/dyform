import type { Component } from 'vue';
import type { FormField } from 'pdyform-core';

import InputRenderer from './components/InputRenderer.vue';
import TextareaRenderer from './components/TextareaRenderer.vue';
import SelectRenderer from './components/SelectRenderer.vue';
import CheckboxRenderer from './components/CheckboxRenderer.vue';
import RadioRenderer from './components/RadioRenderer.vue';
import DateRenderer from './components/DateRenderer.vue';
import SwitchRenderer from './components/SwitchRenderer.vue';

export interface FieldRendererProps {
  field: FormField;
  fieldId: string;
  modelValue: any;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  ariaDescribedby?: string;
}

export type FieldComponentMap = Record<string, Component>;

export const defaultComponentMap: FieldComponentMap = {
  text: InputRenderer,
  number: InputRenderer,
  password: InputRenderer,
  email: InputRenderer,
  textarea: TextareaRenderer,
  select: SelectRenderer,
  checkbox: CheckboxRenderer,
  radio: RadioRenderer,
  date: DateRenderer,
  switch: SwitchRenderer,
};
