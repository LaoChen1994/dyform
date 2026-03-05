import React from 'react';
import type { FieldRenderContext } from './types';
import { Textarea } from './Textarea';

const TextareaRenderer: React.FC<FieldRenderContext> = ({ field, value, onChange, onBlur, fieldId }) => (
  <Textarea
    id={fieldId}
    placeholder={field.placeholder}
    value={value ?? ''}
    onChange={(e) => onChange(e.target.value)}
    onBlur={onBlur}
    disabled={typeof field.disabled === 'boolean' ? field.disabled : undefined}
    name={field.name}
  />
);

export default TextareaRenderer;
