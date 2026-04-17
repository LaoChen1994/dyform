import React from 'react';
import type { FieldRenderContext } from './types';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from './Select';

const SelectRenderer: React.FC<FieldRenderContext> = ({ field, value, onChange, onBlur, fieldId }) => (
  <Select
    value={value != null ? String(value) : ''}
    onValueChange={onChange}
    disabled={typeof field.disabled === 'boolean' ? field.disabled : undefined}
    name={field.name}
    {...field.componentProps}
  >
    <SelectTrigger id={fieldId} onBlur={onBlur}>
      <SelectValue placeholder={field.placeholder || 'Select an option'} />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        {field.options?.map((opt) => (
          <SelectItem key={opt.value} value={String(opt.value)}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectGroup>
    </SelectContent>
  </Select>
);

export default SelectRenderer;
