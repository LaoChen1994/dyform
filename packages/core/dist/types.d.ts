type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'switch';
interface ValidationRule {
    type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'custom';
    value?: unknown;
    message?: string;
    validator?: (value: unknown) => boolean | string | Promise<boolean | string>;
}
interface Option {
    label: string;
    value: string | number;
}
interface FormField {
    id: string;
    name: string;
    label: string;
    type: FieldType;
    placeholder?: string;
    description?: string;
    defaultValue?: unknown;
    options?: Option[];
    validations?: ValidationRule[];
    hidden?: boolean | ((values: Record<string, unknown>) => boolean);
    disabled?: boolean | ((values: Record<string, unknown>) => boolean);
    className?: string;
}
type FormResolver = (values: Record<string, unknown>) => Record<string, string> | Promise<Record<string, string>>;
type ErrorMessageTemplates = {
    required?: string;
    min?: string;
    max?: string;
    email?: string;
    pattern?: string;
    custom?: string;
};
interface FormSchema {
    title?: string;
    description?: string;
    fields: FormField[];
    submitButtonText?: string;
    resolver?: FormResolver;
    errorMessages?: ErrorMessageTemplates;
}
interface FormState {
    values: Record<string, unknown>;
    errors: Record<string, string>;
    validatingFields: string[];
    isSubmitting: boolean;
    isValid: boolean;
}

export type { ErrorMessageTemplates, FieldType, FormField, FormResolver, FormSchema, FormState, Option, ValidationRule };
