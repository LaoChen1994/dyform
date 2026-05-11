export { Input } from './Input';
export { Textarea } from './Textarea';
export { Checkbox } from './Checkbox';
export { Switch } from './Switch';
export { RadioGroup, RadioGroupItem } from './RadioGroup';
export { Select, SelectGroup, SelectValue, SelectTrigger, SelectContent, SelectItem, } from './Select';
export { Label } from './Label';
export { default as InputRenderer } from './InputRenderer';
export { default as TextareaRenderer } from './TextareaRenderer';
export { default as SelectRenderer } from './SelectRenderer';
export { default as CheckboxRenderer } from './CheckboxRenderer';
export { default as RadioRenderer } from './RadioRenderer';
export { default as DateRenderer } from './DateRenderer';
export { default as SwitchRenderer } from './SwitchRenderer';
export type { FieldRenderContext, FieldRenderer, FieldComponentMap } from './types';
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
export declare const defaultComponentMap: FieldComponentMap;
//# sourceMappingURL=index.d.ts.map