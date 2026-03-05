import React from 'react';
import type { FieldRenderContext } from './types';
import { Switch } from './Switch';

const SwitchRenderer: React.FC<FieldRenderContext> = ({
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
    <div className="flex items-center space-x-2">
      <Switch
        id={fieldId}
        checked={!!value}
        onCheckedChange={onChange}
        disabled={typeof field.disabled === 'boolean' ? field.disabled : undefined}
        name={field.name}
        aria-invalid={ariaInvalid}
        aria-required={ariaRequired}
        aria-describedby={ariaDescribedBy}
      />
    </div>
  );
};

export default SwitchRenderer;
