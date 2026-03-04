// ─── Primitive UI components ─────────────────────────────────────────────────
export { default as Input } from './Input.vue';
export { default as Textarea } from './Textarea.vue';
export { default as Checkbox } from './Checkbox.vue';
export { default as RadioGroup } from './RadioGroup.vue';
export { default as RadioGroupItem } from './RadioGroupItem.vue';
export { default as Select } from './Select.vue';
export { default as SelectTrigger } from './SelectTrigger.vue';
export { default as SelectContent } from './SelectContent.vue';
export { default as SelectItem } from './SelectItem.vue';
export { default as Label } from './Label.vue';

// ─── Field renderer components ────────────────────────────────────────────────
export { default as InputRenderer } from './InputRenderer.vue';
export { default as TextareaRenderer } from './TextareaRenderer.vue';
export { default as SelectRenderer } from './SelectRenderer.vue';
export { default as CheckboxRenderer } from './CheckboxRenderer.vue';
export { default as RadioRenderer } from './RadioRenderer.vue';

// ─── Types ───────────────────────────────────────────────────────────────────
export type { FieldComponentMap, FieldRendererProps } from '../fieldComponentMap';

// ─── Default component map ───────────────────────────────────────────────────
export { defaultComponentMap } from '../fieldComponentMap';
