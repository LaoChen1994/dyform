type FieldType = 'text' | 'number' | 'email' | 'password' | 'select' | 'checkbox' | 'radio' | 'textarea' | 'date' | 'switch' | (string & {});
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
    nodeType?: 'field';
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
    componentProps?: Record<string, any>;
    layout?: 'vertical' | 'horizontal' | 'none';
    dependencies?: string[];
}
interface FormGroup {
    nodeType: 'group';
    id?: string;
    title?: string;
    description?: string;
    className?: string;
    elements: FormElement[];
}
interface FormGrid {
    nodeType: 'grid';
    id?: string;
    columns?: number;
    className?: string;
    elements: FormElement[];
}
type FormElement = FormField | FormGroup | FormGrid;
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
    fields?: FormField[];
    elements?: FormElement[];
    submitButtonText?: string;
    resolver?: FormResolver;
    errorMessages?: ErrorMessageTemplates;
    effects?: (engine: any) => void;
}
interface FormState {
    values: Record<string, unknown>;
    errors: Record<string, string>;
    validatingFields: string[];
    isSubmitting: boolean;
    isValid: boolean;
}

export type { ErrorMessageTemplates, FieldType, FormElement, FormField, FormGrid, FormGroup, FormResolver, FormSchema, FormState, Option, ValidationRule };
