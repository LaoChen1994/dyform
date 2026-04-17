import React from 'react';
import { normalizeFieldValue } from 'pdyform-core';
import type { FieldRenderContext } from './types';
import { Input } from './Input';

const InputRenderer: React.FC<FieldRenderContext> = ({
  field,
  value,
  onChange,
  onBlur,
  fieldId,
  ariaInvalid,
  ariaRequired,
  ariaDescribedBy,
}) => {
  const handleChange = (nextValue: string) => {
    onChange(normalizeFieldValue(field, nextValue));
  };

  return (
    <Input
      id={fieldId}
      type={field.type}
      placeholder={field.placeholder}
      value={value ?? ''}
      onChange={(e) => handleChange(e.target.value)}
      onBlur={onBlur}
      disabled={typeof field.disabled === 'boolean' ? field.disabled : undefined}
      name={field.name}
      aria-invalid={ariaInvalid}
      aria-required={ariaRequired}
      aria-describedby={ariaDescribedBy}
    {...field.componentProps}
    />
  );
};

export default InputRenderer;
