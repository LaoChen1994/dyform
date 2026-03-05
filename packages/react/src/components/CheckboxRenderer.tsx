import React from 'react';
import type { FieldRenderContext } from './types';
import { Checkbox } from './Checkbox';
import { Label } from './Label';

const CheckboxRenderer: React.FC<FieldRenderContext> = ({ field, value, onChange, onBlur }) => (
  <div className="flex flex-wrap gap-4">
    {field.options?.map((opt) => {
      const checked = Array.isArray(value) && value.includes(opt.value);
      return (
        <div key={opt.value} className="flex items-center space-x-2">
          <Checkbox
            id={`checkbox-${field.name}-${opt.value}`}
            checked={checked}
            disabled={typeof field.disabled === 'boolean' ? field.disabled : undefined}
            onCheckedChange={(c) => {
              const next = Array.isArray(value) ? [...value] : [];
              if (c) {
                next.push(opt.value);
              } else {
                const idx = next.indexOf(opt.value);
                if (idx > -1) next.splice(idx, 1);
              }
              onChange(next);
            }}
            onBlur={onBlur}
          />
          <Label htmlFor={`checkbox-${field.name}-${opt.value}`} className="font-normal">
            {opt.label}
          </Label>
        </div>
      );
    })}
  </div>
);

export default CheckboxRenderer;
