export type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'switch' | (string & {});

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'custom';
  value?: unknown;
  message?: string;
  validator?: (value: unknown) => boolean | string | Promise<boolean | string>;
}

export interface Option {
  label: string;
  value: string | number;
}

export interface FormField {
  nodeType?: 'field'; // Explicit discriminator
  id: string;
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  defaultValue?: unknown;
  options?: Option[]; // For select, radio, checkbox
  validations?: ValidationRule[];
  hidden?: boolean | ((values: Record<string, unknown>) => boolean);
  disabled?: boolean | ((values: Record<string, unknown>) => boolean);
  className?: string; // CSS class for custom styling
  componentProps?: Record<string, any>; // Extra props for the underlying component
  layout?: 'vertical' | 'horizontal' | 'none'; // How the label is aligned
  dependencies?: string[]; // Fields that trigger this field's validation/re-evaluation
}

export interface FormGroup {
  nodeType: 'group';
  id?: string;
  title?: string;
  description?: string;
  className?: string;
  elements: FormElement[];
}

export interface FormGrid {
  nodeType: 'grid';
  id?: string;
  columns?: number;
  className?: string;
  elements: FormElement[];
}

export type FormElement = FormField | FormGroup | FormGrid;

export type FormResolver = (values: Record<string, unknown>) => Record<string, string> | Promise<Record<string, string>>;

export type ErrorMessageTemplates = {
  required?: string;
  min?: string;
  max?: string;
  email?: string;
  pattern?: string;
  custom?: string;
};

export interface FormSchema {
  title?: string;
  description?: string;
  fields?: FormField[]; // Fallback for backwards compatibility
  elements?: FormElement[]; // Tree-based structure
  submitButtonText?: string;
  resolver?: FormResolver;
  errorMessages?: ErrorMessageTemplates;
  effects?: (engine: any) => void; // Uses 'any' here to avoid circular dependency, properly typed in formState.ts
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  validatingFields: string[];
  isSubmitting: boolean;
  isValid: boolean;
}
