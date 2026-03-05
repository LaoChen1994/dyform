import React from 'react';
import type { FieldRenderContext } from './types';
import { Input } from './Input';

const DateRenderer: React.FC<FieldRenderContext> = ({
  field,
  value,
  onChange,
  onBlur,
  fieldId,
  ariaInvalid,
  ariaRequired,
  ariaDescribedBy,
}) => {
  return (
    <Input
      id={fieldId}
      type="date"
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur}
      disabled={typeof field.disabled === 'boolean' ? field.disabled : undefined}
      name={field.name}
      aria-invalid={ariaInvalid}
      aria-required={ariaRequired}
      aria-describedby={ariaDescribedBy}
    />
  );
};

export default DateRenderer;
