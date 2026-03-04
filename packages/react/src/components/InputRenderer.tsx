import React from 'react';
import type { FieldRenderContext } from './types';
import { Input } from './Input';

const InputRenderer: React.FC<FieldRenderContext> = ({ field, value, onChange, onBlur, fieldId }) => (
  <Input
    id={fieldId}
    type={field.type}
    placeholder={field.placeholder}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    disabled={field.disabled}
    name={field.name}
  />
);

export default InputRenderer;
