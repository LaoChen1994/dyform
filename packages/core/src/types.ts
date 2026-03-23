export type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'switch';

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
}

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
  fields: FormField[];
  submitButtonText?: string;
  resolver?: FormResolver;
  errorMessages?: ErrorMessageTemplates;
}

export interface FormState {
  values: Record<string, unknown>;
  errors: Record<string, string>;
  validatingFields: string[];
  isSubmitting: boolean;
  isValid: boolean;
}
