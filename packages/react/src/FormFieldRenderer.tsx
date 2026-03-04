import React from 'react';
import type { FormField } from 'pdyform/core';
import { Label, defaultComponentMap, InputRenderer } from './components';
import type { FieldComponentMap } from './components';

export interface FormFieldRendererProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  error?: string;
  /**
   * Custom component map merged with the default map — external entries win.
   *
   * @example
   * ```tsx
   * import { defaultComponentMap } from 'pdyform-react';
   * const myMap = { ...defaultComponentMap, text: MyInput, rating: StarRating };
   * <FormFieldRenderer componentMap={myMap} ... />
   * ```
   */
  componentMap?: FieldComponentMap;
}

export const FormFieldRenderer: React.FC<FormFieldRendererProps> = ({
  field,
  value,
  onChange,
  onBlur,
  error,
  componentMap,
}) => {
  const { label, description, name, type } = field;
  const fieldId = `field-${name}`;

  const resolvedMap: FieldComponentMap = componentMap
    ? { ...defaultComponentMap, ...componentMap }
    : defaultComponentMap;

  const FieldComponent = resolvedMap[type] ?? InputRenderer;

  return (
    <div className={`space-y-2 ${field.className || ''}`}>
      {label && <Label htmlFor={fieldId}>{label}</Label>}
      <FieldComponent field={field} value={value} onChange={onChange} onBlur={onBlur} fieldId={fieldId} />
      {description && <p className="text-[0.8rem] text-muted-foreground">{description}</p>}
      {error && <p className="text-[0.8rem] font-medium text-destructive">{error}</p>}
    </div>
  );
};
