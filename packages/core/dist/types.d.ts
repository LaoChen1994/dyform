type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'switch';
interface ValidationRule {
    type: 'required' | 'min' | 'max' | 'pattern' | 'email' | 'custom';
    value?: any;
    message?: string;
    validator?: (value: any) => boolean | string | Promise<boolean | string>;
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
    defaultValue?: any;
    options?: Option[];
    validations?: ValidationRule[];
    hidden?: boolean | ((values: any) => boolean);
    disabled?: boolean | ((values: any) => boolean);
    className?: string;
}
type FormResolver = (values: any) => Record<string, string> | Promise<Record<string, string>>;
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
    values: Record<string, any>;
    errors: Record<string, string>;
    validatingFields: string[];
    isSubmitting: boolean;
    isValid: boolean;
}

export type { ErrorMessageTemplates, FieldType, FormField, FormResolver, FormSchema, FormState, Option, ValidationRule };
