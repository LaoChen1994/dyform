// ─── Primitive UI components ─────────────────────────────────────────────────
export { Input } from './Input';
export { Textarea } from './Textarea';
export { Checkbox } from './Checkbox';
export { RadioGroup, RadioGroupItem } from './RadioGroup';
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from './Select';
export { Label } from './Label';

// ─── Field renderer components ────────────────────────────────────────────────
export { default as InputRenderer } from './InputRenderer';
export { default as TextareaRenderer } from './TextareaRenderer';
export { default as SelectRenderer } from './SelectRenderer';
export { default as CheckboxRenderer } from './CheckboxRenderer';
export { default as RadioRenderer } from './RadioRenderer';

// ─── Types ───────────────────────────────────────────────────────────────────
export type { FieldRenderContext, FieldRenderer, FieldComponentMap } from './types';

// ─── Default component map ───────────────────────────────────────────────────
import InputRenderer from './InputRenderer';
import TextareaRenderer from './TextareaRenderer';
import SelectRenderer from './SelectRenderer';
import CheckboxRenderer from './CheckboxRenderer';
import RadioRenderer from './RadioRenderer';
import type { FieldComponentMap } from './types';

/**
 * The default built-in component map.
 * Import and spread this to extend or override individual field types:
 *
 * @example
 * ```tsx
 * import { defaultComponentMap } from 'pdyform-react';
 * const myMap = { ...defaultComponentMap, text: MyInput, rating: StarRating };
 * <FormFieldRenderer componentMap={myMap} ... />
 * ```
 */
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
