import React from 'react';
import type { FormField } from 'pdyform-core';
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
  const { label, description, name, type, validations } = field;
  const fieldId = `field-${name}`;
  const descriptionId = `${fieldId}-description`;
  const errorId = `${fieldId}-error`;

  const isRequired = validations?.some((v) => v.type === 'required');

  const resolvedMap: FieldComponentMap = componentMap
    ? { ...defaultComponentMap, ...componentMap }
    : defaultComponentMap;

  const FieldComponent = resolvedMap[type] ?? InputRenderer;

  // Combine multiple IDs into one string for aria-describedby
  const describedBy = [
    description ? descriptionId : null,
    error ? errorId : null,
  ].filter(Boolean).join(' ');

  const layout = field.layout || 'vertical';

  return (
    <div className={`${layout === 'horizontal' ? 'flex flex-row items-center gap-4' : 'space-y-2'} ${field.className || ''}`}>
      {label && layout !== 'none' && (
        <Label htmlFor={fieldId} className={isRequired ? "flex items-center gap-1 shrink-0" : "shrink-0"}>
          {label}
          {isRequired && <span className="text-destructive">*</span>}
        </Label>
      )}
      
      <div className={layout === 'horizontal' ? 'flex-1 space-y-2' : 'space-y-2'}>
        <FieldComponent
          field={field}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          fieldId={fieldId}
          errorId={errorId}
          descriptionId={descriptionId}
          ariaInvalid={!!error}
          ariaRequired={isRequired}
          ariaDescribedBy={describedBy || undefined}
        />

        {description && (
          <p id={descriptionId} className="text-[0.8rem] text-muted-foreground">
            {description}
          </p>
        )}
        
        {error && (
          <p id={errorId} className="text-[0.8rem] font-medium text-destructive">
            {error}
          </p>
        )}
      </div>
    </div>
  );
};
