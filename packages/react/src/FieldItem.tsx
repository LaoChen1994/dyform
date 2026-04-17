import React, { memo } from 'react';
import type { FormField } from 'pdyform-core';
import { FormFieldRenderer } from './FormFieldRenderer';
import type { UseFormReturn } from './useForm';
import type { FieldComponentMap } from './components';

export interface FieldItemProps {
  field: FormField;
  form: UseFormReturn;
  componentMap?: FieldComponentMap;
}

export const FieldItem: React.FC<FieldItemProps> = memo(({ field, form, componentMap }) => {
  const { engine, useFieldState } = form;
  const { value, error, touched, isValidating, values, fieldProps } = useFieldState(field.name);

  // Merge static schema field definition with any runtime overrides
  const mergedField = { ...field, ...fieldProps };

  const isHidden = typeof mergedField.hidden === 'function' ? mergedField.hidden(values) : mergedField.hidden;
  const isDisabled = typeof mergedField.disabled === 'function' ? mergedField.disabled(values) : mergedField.disabled;

  if (isHidden) {
    return null;
  }

  const showError = touched && error ? error : undefined;

  return (
    <FormFieldRenderer
      field={{ ...field, disabled: isDisabled || isValidating }}
      value={value}
      onChange={(val) => engine.setFieldValue(field.name, val)}
      onBlur={() => engine.setFieldBlur(field.name)}
      error={showError}
      componentMap={componentMap}
    />
  );
});
