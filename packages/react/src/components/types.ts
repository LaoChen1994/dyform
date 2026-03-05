import type React from 'react';
import type { FormField } from 'pdyform-core';

/** All props passed into each individual field renderer component */
export interface FieldRenderContext {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  onBlur?: () => void;
  fieldId: string;
  errorId?: string;
  descriptionId?: string;
  ariaInvalid?: boolean;
  ariaRequired?: boolean;
  ariaDescribedBy?: string;
}

/** A React component that renders a specific field type */
export type FieldRenderer = React.ComponentType<FieldRenderContext>;

/** Map from field `type` string to its renderer component */
export type FieldComponentMap = Record<string, FieldRenderer>;
