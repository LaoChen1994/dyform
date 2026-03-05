import React from 'react';
import type { FieldRenderContext } from './types';
import { RadioGroup, RadioGroupItem } from './RadioGroup';
import { Label } from './Label';

const RadioRenderer: React.FC<FieldRenderContext> = ({ field, value, onChange, onBlur }) => (
  <RadioGroup
    value={value != null ? String(value) : ''}
    onValueChange={onChange}
    disabled={typeof field.disabled === 'boolean' ? field.disabled : undefined}
    name={field.name}
    className="flex flex-wrap gap-4"
  >
    {field.options?.map((opt) => (
      <div key={opt.value} className="flex items-center space-x-2">
        <RadioGroupItem
          value={String(opt.value)}
          id={`radio-${field.name}-${opt.value}`}
          onBlur={onBlur}
        />
        <Label htmlFor={`radio-${field.name}-${opt.value}`} className="font-normal">
          {opt.label}
        </Label>
      </div>
    ))}
  </RadioGroup>
);

export default RadioRenderer;
